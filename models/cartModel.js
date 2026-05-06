import mongoose from "mongoose";

// 🔥 Cart Item Schema
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // 🔥 FUTURE-PROOF (important)
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

      variantDetails: {
      size: String,
      material: String,
      sku: String,
    },

    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
      max: [10, "Quantity cannot exceed 10"],
    },

    // 🔥 SNAPSHOT (correct)
    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
    },

    name: String,
    image: String,
  },
  { _id: true } // ✅ FIXED
);

// 🔥 Cart Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
