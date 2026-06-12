import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   fullName: {
  type: String,
  required: true,
  trim: true,
  minlength: 3,
  maxlength: 50,
},

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },

   email: {
  type: String,
  trim: true,
  lowercase: true,
  match: [
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Please enter a valid email address",
  ],
},

    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"],
    },

   state: {
  type: String,
  required: true,
  trim: true,
},
city: {
  type: String,
  required: true,
  trim: true,
},
    addressLine1: {
      type: String,
      required: true,
    },

    addressLine2: {
      type: String,
      default: "",
    },

    landmark: {
      type: String,
      default: "",
    },

    addressType: {
      type: String,
      enum: ["HOME", "WORK", "OTHER"],
      default: "HOME",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Address", addressSchema);
