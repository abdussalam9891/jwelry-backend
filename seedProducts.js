import mongoose from "mongoose";
import Product from "./models/productModel.js";

const MONGO_URI =
  "mongodb+srv://abdussalam9891:abdussalam9891@cluster0.vzftnuf.mongodb.net/ecommerce";

/*
==========================================
CONNECT DB
==========================================
*/

const connectDB = async () => {

  console.log(
    "🔌 Connecting to DB..."
  );

  await mongoose.connect(
    MONGO_URI
  );

  console.log(
    "✅ MongoDB Connected"
  );

};

/*
==========================================
IMAGE HELPER
==========================================
*/

const getImages = (
  type,
  materialFolder,
  index
) => [

  `/uploads/products/${type}/${materialFolder}/${index}.webp`,

  `/uploads/products/${type}/${materialFolder}/${index}-2.webp`,

];

/*
==========================================
MATERIALS
==========================================
*/

const MATERIALS = [

  "18K Gold",

  "22K Gold",

  "Silver",

  "Diamond",

  "Rose Gold",

  "White Gold",

  "Platinum",

  "Gemstone",

];

/*
==========================================
SUBCATEGORIES / STYLES
==========================================
*/

const SUBCATEGORIES = [

  "engagement",

  "bridal",

  "luxury",

  "minimal",

  "casual",

  "wedding",

];

/*
==========================================
VARIANTS WITH SIZE
(rings / bracelets)
==========================================
*/

const generateVariantsWithSize = ({

  sizes,

  basePrice,

  type,

}) => {

  const variants = [];

  sizes.forEach((size) => {

    MATERIALS.forEach(
      (material) => {

        const extra =

          material === "22K Gold"
            ? 3000

          : material === "Platinum"
            ? 5000

          : material === "Diamond"
            ? 8000

          : material === "Gemstone"
            ? 4000

          : 0;

        variants.push({

          size,

          material,

          price:
            basePrice +
            extra +
            Math.floor(
              Math.random() * 1000
            ),

          stock:
            Math.floor(
              Math.random() * 5
            ) + 1,

          sku:
            `${type}-${size}-${material}`
              .replace(/\s+/g, "-")
              .toUpperCase(),

        });

      }
    );

  });

  return variants;

};

/*
==========================================
VARIANTS WITHOUT SIZE
(earrings / necklaces)
==========================================
*/

const generateVariantsNoSize = ({

  basePrice,

  type,

}) => {

  return MATERIALS.map(
    (material) => {

      const extra =

        material === "22K Gold"
          ? 3000

        : material === "Platinum"
          ? 5000

        : material === "Diamond"
          ? 8000

        : material === "Gemstone"
          ? 4000

        : 0;

      return {

        size: null,

        material,

        price:
          basePrice + extra,

        stock:
          Math.floor(
            Math.random() * 5
          ) + 1,

        sku:
          `${type}-${material}`
            .replace(/\s+/g, "-")
            .toUpperCase(),

      };

    }
  );

};











/*
==========================================
PRODUCTS ARRAY
==========================================
*/



const getMinPrice = (
  variants
) => {

  return Math.min(

    ...variants.map(
      (variant) =>
        variant.price
    )

  );

};

const getTotalStock = (
  variants
) => {

  return variants.reduce(

    (total, variant) => {

      return (
        total +
        variant.stock
      );

    },

    0
  );

};






const products = [];

/*
==========================================
RINGS
==========================================
*/

const RING_NAMES = [

  "Aurora Ring",

  "Celeste Ring",

  "Nova Ring",

  "Elara Ring",

  "Aurelia Ring",

  "Luna Ring",

  "Solene Ring",

  "Veyra Ring",

  "Aria Ring",

  "Elysia Ring",

];

for (let i = 1; i <= 10; i++) {

  const subcategory =
    SUBCATEGORIES[
      i % SUBCATEGORIES.length
    ];

  /*
    PRODUCT NAME
  */

  const productName =
    RING_NAMES[i - 1];

  /*
    AUTO SLUG
  */

  const slug =
    productName

      .toLowerCase()

      .replace(/\s+/g, "-");

  /*
    GENERATE VARIANTS
  */

  const variants =
    generateVariantsWithSize({

      sizes: [
        "6",
        "7",
        "8",
      ],

      basePrice:
        25000 + i * 1000,

      type:
        `RING${i}`,

    });

  /*
    PUSH PRODUCT
  */

  products.push({

    name:
      productName,

    slug,

    category:
      "rings",

    subcategory,

    gender:
      i % 3 === 0
        ? "kids"
        : i % 2 === 0
        ? "her"
        : "him",

    images:
      getImages(

        "rings",

        "gold",

        (i % 2) + 1
      ),

    description: {

      short:
        "A timeless ring crafted for modern elegance.",

      design:
        "Features precision-set stones with a refined finish.",

      details: [

        "Premium jewelry craftsmanship",

        "Luxury polished finish",

        "Comfort fit design",

        "Certified quality",

      ],

      styling:
        "Perfect for daily wear and special occasions.",

    },

    isBestSeller:
      i % 4 === 0,

    isNewProduct:
      i % 5 === 0,

    /*
      VARIANTS
    */

    variants,

    /*
      DERIVED INVENTORY
    */

    stock:
      getTotalStock(
        variants
      ),

    /*
      MINIMUM VARIANT PRICE
    */

    price:
      getMinPrice(
        variants
      ),

    originalPrice:
      28000 + i * 1000,

  });

}

/*
==========================================
BRACELETS
==========================================
*/
const BRACELET_NAMES = [

  "Celeste Bracelet",

  "Aurora Bracelet",

  "Veyra Bracelet",

  "Aurelia Bracelet",

  "Nyra Bracelet",

  "Elara Bracelet",

  "Solene Bracelet",

  "Luna Bracelet",

  "Serena Bracelet",

  "Elysia Bracelet",

];

for (let i = 1; i <= 10; i++) {

  const subcategory =
    SUBCATEGORIES[
      i % SUBCATEGORIES.length
    ];

  /*
    PRODUCT NAME
  */

  const productName =
    BRACELET_NAMES[i - 1];

  /*
    AUTO SLUG
  */

  const slug =
    productName

      .toLowerCase()

      .replace(/\s+/g, "-");

  /*
    GENERATE VARIANTS
  */

  const variants =
    generateVariantsWithSize({

      sizes: [
        "S",
        "M",
        "L",
      ],

      basePrice:
        12000 + i * 800,

      type:
        `BRACELET${i}`,

    });

  /*
    PUSH PRODUCT
  */

  products.push({

    name:
      productName,

    slug,

    category:
      "bracelets",

    subcategory,

    gender:
      i % 3 === 0
        ? "kids"
        : "her",

    images:
      getImages(

        "bracelets",

        "gold",

        (i % 2) + 1
      ),

    description: {

      short:
        "An elegant bracelet designed for everyday luxury.",

      design:
        "Crafted with smooth edges and premium finishing.",

      details: [

        "Luxury jewelry finish",

        "Comfort fit design",

        "Premium polish",

        "Durable craftsmanship",

      ],

      styling:
        "Pairs beautifully with ethnic and western outfits.",

    },

    isBestSeller:
      i % 3 === 0,

    isNewProduct:
      i % 4 === 0,

    /*
      VARIANTS
    */

    variants,

    /*
      DERIVED STOCK
    */

    stock:
      getTotalStock(
        variants
      ),

    /*
      MINIMUM VARIANT PRICE
    */

    price:
      getMinPrice(
        variants
      ),

    originalPrice:
      15000 + i * 800,

  });

}

/*
==========================================
EARRINGS
==========================================
*/

const EARRING_NAMES = [

  "Aria Earrings",

  "Nyra Earrings",

  "Luna Earrings",

  "Celeste Earrings",

  "Aurora Earrings",

  "Aurelia Earrings",

  "Elara Earrings",

  "Veyra Earrings",

  "Serena Earrings",

  "Elysia Earrings",

];

for (let i = 1; i <= 10; i++) {

  const subcategory =
    SUBCATEGORIES[
      i % SUBCATEGORIES.length
    ];

  /*
    PRODUCT NAME
  */

  const productName =
    EARRING_NAMES[i - 1];

  /*
    AUTO SLUG
  */

  const slug =
    productName

      .toLowerCase()

      .replace(/\s+/g, "-");

  /*
    GENERATE VARIANTS
  */

  const variants =
    generateVariantsNoSize({

      basePrice:
        8000 + i * 500,

      type:
        `EARRING${i}`,

    });

  /*
    PUSH PRODUCT
  */

  products.push({

    name:
      productName,

    slug,

    category:
      "earrings",

    subcategory,

    gender:
      i % 4 === 0
        ? "kids"
        : "her",

    images:
      getImages(

        "earrings",

        "gold",

        (i % 2) + 1
      ),

    description: {

      short:
        "Stylish earrings to elevate your everyday look.",

      design:
        "Minimal yet elegant design with premium detailing.",

      details: [

        "Lightweight construction",

        "Premium shine",

        "Secure closure",

        "Luxury finish",

      ],

      styling:
        "Perfect for office wear and casual outings.",

    },

    isBestSeller:
      i % 2 === 0,

    isNewProduct:
      i % 3 === 0,

    /*
      VARIANTS
    */

    variants,

    /*
      DERIVED STOCK
    */

    stock:
      getTotalStock(
        variants
      ),

    /*
      MINIMUM VARIANT PRICE
    */

    price:
      getMinPrice(
        variants
      ),

    originalPrice:
      10000 + i * 500,

  });

}

/*
==========================================
NECKLACES
==========================================
*/

const NECKLACE_NAMES = [

  "Aurelia Necklace",

  "Celestia Necklace",

  "Aurora Necklace",

  "Veyra Necklace",

  "Serena Necklace",

  "Elara Necklace",

  "Nyra Necklace",

  "Solene Necklace",

  "Luna Necklace",

  "Elysia Necklace",

];

for (let i = 1; i <= 10; i++) {

  const subcategory =
    SUBCATEGORIES[
      i % SUBCATEGORIES.length
    ];

  /*
    PRODUCT NAME
  */

  const productName =
    NECKLACE_NAMES[i - 1];

  /*
    AUTO SLUG
  */

  const slug =
    productName

      .toLowerCase()

      .replace(/\s+/g, "-");

  /*
    GENERATE VARIANTS
  */

  const variants =
    generateVariantsNoSize({

      basePrice:
        30000 + i * 1500,

      type:
        `NECKLACE${i}`,

    });

  /*
    PUSH PRODUCT
  */

  products.push({

    name:
      productName,

    slug,

    category:
      "necklaces",

    subcategory,

    gender:
      i % 5 === 0
        ? "kids"
        : "her",

    images:
      getImages(

        "necklaces",

        "gold",

        (i % 2) + 1
      ),

    description: {

      short:
        "A luxurious necklace crafted to make a statement.",

      design:
        "Intricate craftsmanship with a modern aesthetic.",

      details: [

        "Luxury finish",

        "Adjustable chain",

        "Skin-friendly material",

        "Premium polish",

      ],

      styling:
        "Ideal for weddings and festive occasions.",

    },

    isBestSeller:
      i % 2 === 0,

    isNewProduct:
      i % 3 === 0,

    /*
      VARIANTS
    */

    variants,

    /*
      DERIVED STOCK
    */

    stock:
      getTotalStock(
        variants
      ),

    /*
      MINIMUM VARIANT PRICE
    */

    price:
      getMinPrice(
        variants
      ),

    originalPrice:
      35000 + i * 1500,

  });

}

/*
==========================================
SEED DATABASE
==========================================
*/

const seedProducts =
  async () => {

    try {

      await connectDB();

      console.log(
        "🧹 Clearing old products..."
      );

      await Product.deleteMany({});

      console.log(
        "📦 Seeding products..."
      );

      await Product.insertMany(
        products
      );

      console.log(
        `🔥 ${products.length} Products Seeded`
      );

      process.exit();

    } catch (err) {

      console.error(
        "❌ ERROR:",
        err
      );

      process.exit(1);

    }

  };

seedProducts();
