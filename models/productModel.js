import mongoose from "mongoose";

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

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
    },

    // 🔥 MATERIAL / COLLECTION
    category: {
      type: String,
      required: true,
      index: true,
      enum: ["gold", "diamond", "gemstone", "silver"],
    },

    // 🔥 PRODUCT TYPE
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
      validate: v => v.length > 0,
    },

    description: String,

    isBestSeller: {
      type: Boolean,
      default: false,
    },

   isNewProduct: {
  type: Boolean,
  default: false,
},

    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 INDEXES
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
