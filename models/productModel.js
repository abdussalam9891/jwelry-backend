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
       min: 0,
    },

    stock: {
      type: Number,
      default: 0,
       min: 0,
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
       min: 0,
    },

    originalPrice: {
      type: Number,
       min: 0,
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

  validate: {
    validator: function (v) {
      return Array.isArray(v) && v.length > 0;
    },

    message: "At least one image is required",
  },
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
   min: 0,
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
       min: 0,
    },
    sku: {
  type: String,
  unique: true,
  sparse: true,
},
  },
  { timestamps: true },
);



productSchema.pre("save",  async function (next) {

 if (
  Array.isArray(this.variants) &&
  this.variants.length > 0
) {

    this.stock = this.variants.reduce(

      (total, variant) => {

        return total + variant.stock;

      },

      0
    );

    this.price = Math.min(

      ...this.variants.map(
        (variant) => variant.price
      )

    );

  }



});





//  INDEXES
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
