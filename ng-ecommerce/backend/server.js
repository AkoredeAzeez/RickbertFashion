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

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;


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
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
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
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only images allowed"), false),
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
        const fullPath = path.join(process.cwd(), imgPath.replace(/^\//, ""));
        fs.unlink(fullPath, (err) => {
          if (err) console.error("⚠️ Failed to delete image:", fullPath, err.message);
        });
      });
    }

    res.json({ message: "✅ Product and images deleted", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, brand, sizes, colors, stock } = req.body;
    const imageUrl = req.file ? `${CLIENT_URL}/uploads/${req.file.filename}` : null;

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
    const { amount, email } = req.body;
    if (!amount || !email) return res.status(400).json({ message: "Amount and email are required" });

    const redirectUrl = `${CLIENT_URL}/payment-success`; // frontend success page

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { 
        amount: amount, 
        email, 
        callback_url: redirectUrl 
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = response.data.data;

    await Order.create({ ...req.body, reference, status: "pending" });

    res.json({ reference, authorization_url });
  } catch (err) {
    console.error("Paystack initiate error:", err.response?.data || err.message);
    res.status(500).json({ message: "Payment initiation failed" });
  }
});

app.get("/api/checkout/paystack/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const data = response.data.data;
    const order = await Order.findOne({ reference });

    if (order) {
      order.status = data.status === "success" ? "paid" : "failed";
      await order.save();
    }

    res.json({ status: data.status, order });
  } catch (err) {
    console.error("Paystack verify error:", err.response?.data || err.message);
    res.status(500).json({ message: "Paystack verification failed" });
  }
});

// ===== Save Order to Google Sheets =====
app.post("/api/checkout/save-order", async (req, res) => {
  try {
    const { name, email, phone, address, total, cart } = req.body;
    await axios.post(
      "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
      { name, email, phone, address, total, cart }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Google Sheets error:", err.message);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ===== Start Server =====
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 API running on port ${PORT}`));
