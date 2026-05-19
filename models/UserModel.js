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
  unique: true,
  sparse: true,
  lowercase: true,
  trim: true,
},
   phone: {
  type: String,
  unique: true,
  sparse: true, // allow google-only users without phone
  trim: true,
},
isPhoneVerified: {
  type: Boolean,
  default: false,
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
    isBlocked: {
   type: Boolean,
   default: false,
},

notificationPreferences: {

  orders: {

    type: Boolean,

    default: true,

  },

  stockAlerts: {

    type: Boolean,

    default: true,

  },

  customers: {

    type: Boolean,

    default: false,

  },

},

    // AUTH PROVIDER (scalable)
   provider: {
  type: String,
  enum: ["google", "phone"],
  default: "google",
},
    lastLoginAt: Date,

  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
