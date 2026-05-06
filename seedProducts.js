import mongoose from "mongoose";
import Product from "./models/productModel.js";

const MONGO_URI = "mongodb+srv://abdussalam9891:abdussalam9891@cluster0.vzftnuf.mongodb.net/ecommerce";

const connectDB = async () => {
  console.log("🔌 Connecting to DB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB Connected");
};




const getImages = (type, category, index) => [
  `/uploads/products/${type}/${category}/${index}.webp`,
  `/uploads/products/${type}/${category}/${index}-2.webp`,
];

// 🔥 dynamic materials based on category
const getMaterials = (category) => {
  if (category === "gemstone") {
    return ["ruby", "emerald", "sapphire"];
  }
  return ["18k", "22k"];
};

const generateVariantsWithSize = ({ sizes, category, basePrice, type }) => {
  const materials = getMaterials(category);
  const variants = [];

  sizes.forEach((size) => {
    materials.forEach((material) => {
      const extra =
        material === "22k" ? 3000 :
        material === "emerald" ? 2000 :
        material === "ruby" ? 2500 :
        material === "sapphire" ? 3000 : 0;

      variants.push({
        size,
        material,
        price: basePrice + extra + Math.floor(Math.random() * 1000),
        stock: Math.floor(Math.random() * 5) + 1,
        sku: `${type}-${size}-${material.toUpperCase()}`,
      });
    });
  });

  return variants;
};

const generateVariantsNoSize = ({ category, basePrice, type }) => {
  const materials = getMaterials(category);

  return materials.map((material) => ({
    size: null,
    material,
    price: basePrice + (material === "22k" ? 3000 : 0),
    stock: Math.floor(Math.random() * 5) + 1,
    sku: `${type}-${material.toUpperCase()}`,
  }));
};





const products = [];
const metalCategories = ["gold", "silver", "diamond"];
const allCategories = ["gold", "silver", "diamond", "gemstone"];






 for (let i = 1; i <= 10; i++) {
  const category = allCategories[i % allCategories.length];

  products.push({
    name: `${category} Ring ${i}`,
    slug: `${category}-ring-${i}`,
    price: 25000 + i * 1000,
    originalPrice: 28000 + i * 1000,

    category,
    subcategory: "rings",
   gender: i % 3 === 0 ? "kids" : i % 2 === 0 ? "her" : "him",
isBestSeller: i % 4 === 0,
isNewProduct: i % 5 === 0,

    images: getImages("rings", category, (i % 2) + 1),
    description: {
  short: "A timeless ring crafted for modern elegance.",
  design: "Features precision-set stones with a refined finish.",
  details: [
    `${category === "gold" ? "18k Gold" : category === "silver" ? "925 Silver" : "Premium Alloy"}`,
    "High polish finish",
    "Available in sizes 6, 7, 8",
    "Certified quality"
  ],
  styling: "Perfect for daily wear and special occasions."
},

    variants: generateVariantsWithSize({
      sizes: ["6", "7", "8"],
      category,
      basePrice: 25000 + i * 1000,
      type: `RING${i}`,
    }),

    stock: 0,
  });
}
for (let i = 1; i <= 10; i++) {
  const category = metalCategories[i % metalCategories.length];

  products.push({
    name: `${category} Bracelet ${i}`,
    slug: `${category}-bracelet-${i}`,
    price: 12000 + i * 800,
    originalPrice: 15000 + i * 800,

    category,
    subcategory: "bracelets",
   gender: i % 3 === 0 ? "kids" : "her",
isBestSeller: i % 3 === 0,
isNewProduct: i % 4 === 0,

    images: getImages("bracelets", category, (i % 2) + 1),
   description: {
  short: "An elegant bracelet designed for everyday luxury.",
  design: "Crafted with smooth edges and premium finishing.",
  details: [
    `${category === "gold" ? "18k Gold" : category === "silver" ? "925 Silver" : "Premium Alloy"}`,
    "Comfort fit design",
    "Available in S, M, L sizes",
    "Durable and lightweight"
  ],
  styling: "Pairs beautifully with both ethnic and western outfits."
},

    variants: generateVariantsWithSize({
      sizes: ["S", "M", "L"],
      category,
      basePrice: 12000 + i * 800,
      type: `BRACELET${i}`,
    }),

    stock: 0,
  });
}



for (let i = 1; i <= 10; i++) {
  const category = allCategories[i % allCategories.length];

  products.push({
    name: `${category} Earrings ${i}`,
    slug: `${category}-earrings-${i}`,
    price: 8000 + i * 500,
    originalPrice: 10000 + i * 500,

    category,
    subcategory: "earrings",
    gender: i % 4 === 0 ? "kids" : "her",
isBestSeller: i % 2 === 0,
isNewProduct: i % 3 === 0,

    images: getImages("earrings", category, (i % 2) + 1),
    description: {
  short: "Stylish earrings to elevate your everyday look.",
  design: "Minimal yet elegant design with premium detailing.",
  details: [
    `${category === "gold" ? "18k Gold" : category === "silver" ? "925 Silver" : "Premium Alloy"}`,
    "Lightweight and comfortable",
    "Secure push-back closure",
    "High shine finish"
  ],
  styling: "Perfect for office wear and casual outings."
},

    variants: generateVariantsNoSize({
      category,
      basePrice: 8000 + i * 500,
      type: `EARRING${i}`,
    }),

    stock: 0,
  });
}




for (let i = 1; i <= 10; i++) {
  const category = allCategories[i % allCategories.length];

  products.push({
    name: `${category} Necklace ${i}`,
    slug: `${category}-necklace-${i}`,
    price: 30000 + i * 1500,
    originalPrice: 35000 + i * 1500,

    category,
    subcategory: "necklaces",
   gender: i % 5 === 0 ? "kids" : "her",
isBestSeller: i % 2 === 0,
isNewProduct: i % 3 === 0,

    images: getImages("necklaces", category, (i % 2) + 1),
   description: {
  short: "A luxurious necklace crafted to make a statement.",
  design: "Intricate craftsmanship with a modern aesthetic.",
  details: [
    `${category === "gold" ? "18k Gold" : category === "silver" ? "925 Silver" : "Premium Alloy"}`,
    "Adjustable chain length",
    "Fine polished finish",
    "Skin-friendly material"
  ],
  styling: "Ideal for weddings, parties, and festive occasions."
},

    variants: generateVariantsNoSize({
      category,
      basePrice: 30000 + i * 1500,
      type: `NECKLACE${i}`,
    }),

    stock: 0,
  });
}


const seedProducts = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing products...");
    await Product.deleteMany();

    console.log("📦 Inserting products...");
    await Product.insertMany(products);

    console.log(`🔥 ${products.length} Products Seeded`);

    process.exit();
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
};

seedProducts();


