import express from "express";
import Product from "../models/Product.js"; 

const router = express.Router();

// ✅ GET all products
router.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// ✅ GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ message: "Server error fetching product" });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ⚠️ Note: we’re not deleting images from Cloudinary here
    // If needed, you’d store the public_id and call cloudinary.uploader.destroy(public_id)

    res.json({ message: "Product deleted", product });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Server error deleting product" });
  }
});

// ✅ POST new product (now expects imageUrl from Cloudinary)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, brand, sizes, colors, stock, images } = req.body;
    console.log("✅ Received images from frontend:", images);
    if (!name || !price || !images) {
      return res.status(400).json({ message: "Name, price, and imageUrl are required" });
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
    console.log(`🎉 Product saved: ${product.name} with ${images.length} image(s)`);
    res.status(201).json(product);
  } catch (err) {
    console.error("Product upload failed:", err);
    res.status(500).json({ message: "Server error uploading product" });
  }
});

export default router;
