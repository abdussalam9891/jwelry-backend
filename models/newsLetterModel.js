import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
       match: [
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Please provide a valid email address.",
  ],
    },

    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
      index: true,
    },

    source: {
      type: String,
      enum: [
        "footer",
        "popup",
        "checkout",
        "account",
        "admin",
        "api",
      ],
      default: "footer",
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: {
      type: Date,
      default: null,
    },

    lastEmailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Newsletter", newsletterSchema);
