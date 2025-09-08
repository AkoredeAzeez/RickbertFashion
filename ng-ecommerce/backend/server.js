/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import {
  BACKEND_URL,
  CLIENT_URL,
  MONGODB_URI,
  PAYSTACK_SECRET_KEY,
  PORT,
} from "./constants.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
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

// ===== Multer Config =====
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
        // If imgPath is a full URL, extract only the "/uploads/..." part
        let relativePath = imgPath;

        if (imgPath.startsWith("http")) {
          try {
            const urlObj = new URL(imgPath);
            relativePath = urlObj.pathname; // "/uploads/..."
          } catch (err) {
            console.error("⚠️ Invalid URL in product.images:", imgPath);
            return; // skip this one
          }
        }

        const fullPath = path.join(
          process.cwd(),
          relativePath.replace(/^\//, "")
        );
        console.log("🗑️ Attempting to delete:", fullPath);

        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error("⚠️ Failed to delete image:", fullPath, err.message);
          } else {
            console.log("✅ Successfully deleted:", fullPath);
          }
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

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, brand, sizes, colors, stock } =
      req.body;

    const imageUrl = req.file
      ? `${BACKEND_URL}/uploads/${req.file.filename}`
      : null;
    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      sizes: sizes ? sizes.split(",") : [],
      colors: colors ? colors.split(",") : [],
      stock,
      inStock: stock > 0,
      images: imageUrl ? [imageUrl] : [],
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
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

    const redirectUrl = `${CLIENT_URL}/payment-success`; // frontend success page

    // 🔹 Step 1: Initialize Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { amount, email, callback_url: redirectUrl },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = response.data.data;

    // 🔹 Step 2: Save order to MongoDB with cart
    const order = new Order({
      items: cart.map((item) => ({
        product: item._id, // assumes cart item has _id from MongoDB
        qty: item.qty,
        price: item.price,
      })),
      customer: { name, email, phone, address },
      amount: amount / 100, // convert back to naira
      status: "pending",
      reference,
    });

    await order.save();

    // 🔹 Step 3: Send Paystack authorization URL back
    res.json({ reference, authorization_url });
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

    // 🔹 Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      }
    );

    const data = response.data.data;

    // 🔹 Find the matching order in DB and populate products
    let order = await Order.findOne({ reference }).populate("items.product");

    if (order) {
      order.status = data.status === "success" ? "paid" : "failed";
      await order.save();
    } else {
      // 🔹 Fallback: construct minimal order if DB doesn’t have one
      order = {
        customer: {
          name: data.customer.first_name + " " + data.customer.last_name,
          email: data.customer.email,
          phone: data.customer.phone,
          address: "",
        },
        items: [],
        amount: data.amount / 100, // convert from kobo
        status: data.status,
      };
    }

    res.json({ status: data.status, order });
  } catch (err) {
    console.error("Paystack verify error:", err.response?.data || err.message);
    res.status(500).json({ message: "Paystack verification failed" });
  }
});
// ===== Orders Routes =====
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price") // only return name + price of products
      .sort({ createdAt: -1 }); // newest first

    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
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
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 API running on port ${PORT}`)
);
