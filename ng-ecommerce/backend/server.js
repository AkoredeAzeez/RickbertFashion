import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ====== Fix: resolve __dirname in ES Modules ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 serve uploaded images (absolute path safer than "uploads/")
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const { PORT = 4000, MONGODB_URI, PAYSTACK_SECRET_KEY } = process.env;

mongoose
  .connect(MONGODB_URI, { dbName: "ng_ecommerce_demo" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("MongoDB error:", e));

// ====== Schemas ======
const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number, // Naira
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
        price: Number, // snapshot at purchase time
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

// ====== Multer Config ======
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

// ====== Health ======
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ====== Products ======
app.get("/api/products", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

// 🔹 Upload product with image
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, brand, sizes, colors, stock } = req.body;

    // Absolute URL for frontend
    const imageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

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

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
