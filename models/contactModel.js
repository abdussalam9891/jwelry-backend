import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Order Support",
        "Product Inquiry",
        "Shipping",
        "Returns & Refunds",
        "Warranty",
        "Other",
      ],
      required: true,
    },

    orderNumber: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Unread",
        "In Progress",
        "Resolved",
      ],
      default: "Unread",
      index: true,
    },

    adminNote: {
      type: String,
      default: "",
    },

    resolvedAt: Date,
  },
  
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Contact",
  contactSchema
);
