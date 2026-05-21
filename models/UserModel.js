import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
isEmailVerified: {
  type: Boolean,
  default: false
},

emailOtp: {
  type: String,
  default: null,
},

emailOtpExpires: {
  type: Date,
  default: null,
},
password: {
  type: String,
  minlength: 6,
  select: false,
},
passwordResetToken: String,
passwordResetExpires: Date,
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
  type: [String],
  enum: ["google", "phone", "email"],
  default: [],
},
    lastLoginAt: Date,

  },
  { timestamps: true }
);






userSchema.pre("save", async function ( ) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);


});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
