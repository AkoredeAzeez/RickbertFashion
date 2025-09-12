/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";
import { WebSocketServer } from "ws";

import {
  BACKEND_URL,
  CLIENT_URL,
  MONGODB_URI,
  PAYSTACK_SECRET_KEY,
  PORT,
} from "./constants.js";

const app = express();
const server = http.createServer(app); // use http server for WS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: CLIENT_URL }));

// ===== WebSocket Setup =====
const wss = new WebSocketServer({ server });
const broadcast = (message) => {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
};
wss.on("connection", (ws) => {
  console.log("🔌 WebSocket client connected");
  ws.on("close", () => console.log("❌ WebSocket client disconnected"));
});

// ===== Middleware =====
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== MongoDB Connection =====
mongoose
  .connect(MONGODB_URI, { dbName: "ng_ecommerce_demo" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("MongoDB error:", e));

// ===== Schemas =====
const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    images: [String],
    category: String,
    brand: String,
    sizes: [String],
    colors: [String],
    stock: Number,
    inStock: Boolean,
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number,
      },
    ],
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    gateway: { type: String, default: "paystack" },
    reference: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

// ===== Multer Config (optional for future local uploads) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only images allowed"), false),
});

// ===== Health Check =====
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ===== Products Routes =====
app.get("/api/products", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        let relativePath = imgPath;
        if (imgPath.startsWith("http")) {
          try {
            const urlObj = new URL(imgPath);
            relativePath = urlObj.pathname;
          } catch (err) {
            console.error("⚠️ Invalid URL in product.images:", imgPath);
            return;
          }
        }
        const fullPath = path.join(
          process.cwd(),
          relativePath.replace(/^\//, "")
        );
        console.log("🗑️ Attempting to delete:", fullPath);
        fs.unlink(fullPath, (err) => {
          if (err)
            console.error("⚠️ Failed to delete image:", fullPath, err.message);
          else console.log("✅ Successfully deleted:", fullPath);
        });
      });
    } else {
      console.log("ℹ️ No images to delete for this product.");
    }

    res.json({ message: "✅ Product and images deleted", product });
  } catch (err) {
    console.error("❌ Delete route error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// ===== Updated POST /api/products =====
app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      sizes,
      colors,
      stock,
      images,
    } = req.body;

    console.log("✅ Backend received new product request");
    console.log("Images:", images);

    if (!name || !price || !images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "Name, price, and images are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      sizes: Array.isArray(sizes) ? sizes : sizes?.split(",") || [],
      colors: Array.isArray(colors) ? colors : colors?.split(",") || [],
      stock,
      inStock: stock > 0,
      images,
    });

    await product.save();
    console.log(
      `🎉 Product saved: ${product.name} with ${images.length} image(s)`
    );

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product upload failed:", err);
    res.status(500).json({ message: "Product upload failed" });
  }
});

// ===== Paystack Payment =====
app.post("/api/checkout/paystack/initiate", async (req, res) => {
  try {
    const { amount, email, name, phone, address, cart } = req.body;
    if (!amount || !email) {
      return res.status(400).json({ message: "Amount and email are required" });
    }

    const redirectUrl = `${CLIENT_URL}/payment-success`;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { amount, email, callback_url: redirectUrl },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    const { reference, authorization_url } = response.data.data;

    const order = new Order({
      items: cart.map((item) => ({
        product: item._id || null,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      customer: { name, email, phone, address },
      amount: amount / 100,
      status: "pending",
      reference,
    });

    await order.save();

    // 🔔 Broadcast new order
    broadcast({ type: "NEW_ORDER", order });

    res.json({
      success: true,
      reference,
      authorization_url,
      orderId: order._id,
    });
  } catch (err) {
    console.error(
      "Paystack initiate error:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Payment initiation failed" });
  }
});

app.get("/api/checkout/paystack/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    const { status } = verifyRes.data.data;
    const order = await Order.findOne({ reference });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "success") {
      order.status = "paid";
      await order.save();

      // 🔔 Broadcast payment confirmation
      broadcast({ type: "PAYMENT_CONFIRMED", order });
    }

    res.json({ status, order });
  } catch (err) {
    console.error("Paystack verify error:", err.response?.data || err.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// ===== Orders Routes =====
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔔 Broadcast order update
    broadcast({ type: "ORDER_UPDATED", order });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔔 Broadcast order deletion
    broadcast({ type: "ORDER_DELETED", orderId: req.params.id });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== Save Order to Google Sheets =====
app.post("/api/checkout/save-order", async (req, res) => {
  try {
    const { name, email, phone, address, total, cart } = req.body;
    await axios.post("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
      name,
      email,
      phone,
      address,
      total,
      cart,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Google Sheets error:", err.message);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ===== Start Server =====
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 API + WS running on port ${PORT}`)
);
