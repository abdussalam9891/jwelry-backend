import mongoose from "mongoose";

const otpSchema =
  new mongoose.Schema(
    {
      phone: {
        type: String,
        required: true,
        index: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  );

const Otp =
  mongoose.models.Otp ||
  mongoose.model("Otp", otpSchema);

export default Otp;
