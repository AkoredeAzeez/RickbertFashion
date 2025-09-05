import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

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
    inStock: Boolean
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number // snapshot at purchase time
      }
    ],
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String
    },
    amount: Number, // total in Naira
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    gateway: { type: String, default: "paystack" },
    reference: String
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

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

// ====== Seed (demo only) ======
app.post("/api/seed", async (_req, res) => {
  const count = await Product.countDocuments();
  if (count > 0) return res.json({ message: "Already seeded" });

  const demo = [
    {
      name: "Ankara Midi Dress",
      description: "Vibrant Ankara print, perfect for outings.",
      price: 18000,
      images: ["https://picsum.photos/seed/ankara/600/600"],
      category: "Women",
      brand: "NaijaStyle",
      sizes: ["S", "M", "L"],
      colors: ["red", "yellow"],
      stock: 20,
      inStock: true
    },
    {
      name: "Agbada Set",
      description: "Classic agbada with fine embroidery.",
      price: 75000,
      images: ["https://picsum.photos/seed/agbada/600/600"],
      category: "Men",
      brand: "RoyalThreads",
      sizes: ["M", "L", "XL"],
      colors: ["blue"],
      stock: 8,
      inStock: true
    },
    {
      name: "Sneakers - White",
      description: "Clean everyday sneakers.",
      price: 23000,
      images: ["https://picsum.photos/seed/sneakers/600/600"],
      category: "Footwear",
      brand: "StreetFlex",
      sizes: ["41", "42", "43", "44"],
      colors: ["white"],
      stock: 15,
      inStock: true
    }
  ];

  await Product.insertMany(demo);
  res.json({ message: "Seeded", count: demo.length });
});

// ====== Checkout (Paystack Sandbox) ======
app.post("/api/checkout/paystack/initiate", async (req, res) => {
  try {
    const { items, customer } = req.body;
    if (!Array.isArray(items) || !customer?.email)
      return res.status(400).json({ message: "Invalid payload" });

    // Calculate total from products to avoid tampering
    const ids = items.map((i) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: ids } });
    const map = Object.fromEntries(dbProducts.map((p) => [String(p._id), p]));
    const normalized = items.map((i) => ({
      product: i.productId,
      qty: i.qty,
      price: map[i.productId]?.price ?? 0
    }));
    const amount = normalized.reduce((sum, i) => sum + i.qty * i.price, 0);

    // Create pending order
    const order = await Order.create({
      items: normalized,
      customer,
      amount,
      status: "pending",
      gateway: "paystack"
    });

    // Init with Paystack (amount in kobo)
    const initRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: customer.email,
        amount: amount * 100,
        metadata: { orderId: String(order._id) },
        callback_url: `${process.env.CLIENT_URL}/payment/callback`
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const { authorization_url, reference } = initRes.data.data;
    order.reference = reference;
    await order.save();

    res.json({ authorization_url, reference, orderId: order._id });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ message: "Payment init failed" });
  }
});

app.get("/api/checkout/paystack/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    const status = verifyRes.data.data.status; // 'success' | 'failed' | 'abandoned'
    const order = await Order.findOne({ reference });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status === "success" ? "paid" : status === "failed" ? "failed" : "pending";
    await order.save();

    res.json({ status: order.status, orderId: order._id });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ message: "Verification failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
