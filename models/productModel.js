import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String, // e.g. "6", "7", "8"
    },

    material: {
      type: String, // e.g. "18k", "22k"
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
    },
  },
  { _id: true }, // important for cart reference
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    //  BASE PRICE (for listing)
    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
      enum: ["gold", "diamond", "gemstone", "silver"],
    },

    subcategory: {
      type: String,
      required: true,
      index: true,
      enum: ["rings", "earrings", "necklaces", "bracelets"],
    },

    gender: {
      type: String,
      enum: ["him", "her", "kids"],
      index: true,
    },

    images: {
      type: [String],
      validate: (v) => v.length > 0,
    },

    description: {
      short: String,
      design: String,
      details: [String],
      styling: String,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    lowStockThreshold: {
  type: Number,
  default: 5,
},

    isNewProduct: {
      type: Boolean,
      default: false,
      index: true,
    },

    //  VARIANTS (REAL SOURCE OF TRUTH)
    variants: [variantSchema],

    //  FALLBACK STOCK (only if no variants)
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
  type: String,
  unique: true,
  sparse: true,
},
  },
  { timestamps: true },
);

//  INDEXES
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
