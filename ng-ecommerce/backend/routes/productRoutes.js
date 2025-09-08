import express from "express";
import Product from "../models/Product.js"; // Assuming you have a Product model
import multer from "multer";
import path from "path";
import fs from "fs";
import { BACKEND_URL } from "../constants.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});
const upload = multer({ storage });

// GET all products
router.get("/", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// GET product by ID
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete associated images
    if (product.images && product.images.length) {
      product.images.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), imgPath.replace(/^\//, ""));
        fs.unlink(fullPath, (err) => {
          if (err)
            console.error("Failed to delete image:", fullPath, err.message);
        });
      });
    }

    res.json({ message: "Product deleted", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// POST upload product
router.post("/", upload.single("image"), async (req, res) => {
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

export default router;
