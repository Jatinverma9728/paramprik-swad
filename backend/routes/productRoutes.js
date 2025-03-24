const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.category,
      isAvailable: true 
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new product
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const product = new Product({
      ...req.body,
      imageUrl,
      price: Number(req.body.price),
      stock: Number(req.body.stock)
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updates,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
