import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

const categories = ["rings", "earrings", "necklaces", "bracelets"];

// helper → generate price based on material
const getPrice = (material) => {
  if (material === "diamond") return Math.floor(Math.random() * 6000) + 6000;
  if (material === "gold") return Math.floor(Math.random() * 4000) + 3000;
  return Math.floor(Math.random() * 2000) + 1000; // silver
};

const getOriginalPrice = (price) => {
  return price + Math.floor(Math.random() * 2000) + 1000;
};

// helper → generate gender
const getGender = (i) => {
  if (i % 5 === 0) return "him";
  if (i % 7 === 0) return "kids";
  return "her";
};

const getImages = (subcategory, material, id) => {
  const base = (id % 5) + 1; // 1–5 loop

  return [
    `http://localhost:5000/uploads/products/${subcategory}/${material}/${base}.webp`,
    `http://localhost:5000/uploads/products/${subcategory}/${material}/${base}-2.webp`,
  ];
};

const generateProducts = () => {
  const products = [];
  let id = 1;

  categories.forEach((subcategory) => {
    for (let i = 0; i < 10; i++) {
      let material;

      // 4 gold, 3 diamond, 3 silver
      if (i < 4) material = "gold";
      else if (i < 7) material = "diamond";
      else material = "silver";

      const price = getPrice(material);

     products.push({
  name: `${material} ${subcategory} ${id}`,
  slug: `${material}-${subcategory}-${id}`,

  price: price,
  originalPrice: getOriginalPrice(price),

  category: material,
  subcategory: subcategory,
  gender: getGender(i),

  images: getImages(subcategory, material, id), // ✅ FIXED

  description: `Premium ${material} ${subcategory} crafted for everyday elegance.`,

  isBestSeller: id % 6 === 0,
  isNew: id % 8 === 0,

  stock: Math.floor(Math.random() * 20) + 1,
});

      id++;
    }
  });

  return products;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB");

    await Product.deleteMany();
    console.log("Old products removed");

    const products = generateProducts();

    await Product.insertMany(products);

    console.log("🔥 40 structured products seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedProducts();
