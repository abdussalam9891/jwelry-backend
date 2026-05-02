import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, //  allows non-google users later
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    // ROLE (CRITICAL)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    // ACCOUNT STATUS (future-proof)
    isActive: {
      type: Boolean,
      default: true,
    },

    // AUTH PROVIDER (scalable)
    provider: {
      type: String,
      enum: ["google", "local"],
      default: "google",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
