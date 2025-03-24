const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: "Organic Turmeric Powder",
    description: "Premium quality organic turmeric powder with high curcumin content.",
    price: 50,
    category: "Spices",
    imageUrl: "/images/products/turmric.jpg",
    stock: 100,
    isAvailable: true,
    sizes: [
      { size: "100g", price: 50 },
      { size: "200g", price: 100 }
    ]
  },
  {
    name: "Pure Desi Ghee",
    description: "Traditional clarified butter made from pure cow milk.",
    price: 600,
    category: "Dairy",
    imageUrl: "/images/products/ghee.jpg",
    stock: 50,
    isAvailable: true,
    sizes: [
      { size: "200ml", price: 300 },
      { size: "500ml", price: 600 },
      { size: "1L", price: 1100 }
    ]
  },
  {
    name: "Organic Red Chilli Powder",
    description: "Premium quality organic red chili Powder.",
    category: "Spices",
    imageUrl: "/images/products/red-chilli.webp",
    stock: 75,
    isAvailable: true,
    price: 50,
    sizes: [
      { size: "100g", price: 50 },
      { size: "200g", price: 100 }
    ]
  },
  {
    name: "Premium Basmati Rice",
    description: "Aged premium basmati rice with long grains.",
    category: "Rice",
    imageUrl: "/images/products/rice-3506194_1920.jpg",
    stock: 100,
    isAvailable: true,
    price: 115,
    sizes: [
      { size: "500g", price: 115 },
      { size: "1kg", price: 230 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Delete existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    for (const product of products) {
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`Added product: ${product.name}`);
    }

    console.log('Database seeding completed');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error details:', error);
    process.exit(1);
  }
};

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Run the seed function
seedDatabase();
