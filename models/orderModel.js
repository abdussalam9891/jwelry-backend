import mongoose from "mongoose";



const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    slug: {
      type: String,
    },

    // SNAPSHOT DATA
    // important because products can change later

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // VARIANT SNAPSHOT
  variant: {

  variantId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  sku: String,

  size: String,

  material: String,

},
  },
  { _id: false }
);



const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
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
  },
  { _id: false }
);



const orderSchema = new mongoose.Schema(
  {
    // HUMAN READABLE ORDER ID
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    /* USER REFERENCE */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* CUSTOMER SNAPSHOT */

    customerName: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },

    /* PRICE BREAKDOWN */

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    taxPrice: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    /* BUSINESS STATUS */

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
      index: true,
    },

    statusHistory: [

  {

    status: {
      type: String,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },

  },

],

    /* PAYMENT STATUS */

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
      index: true,
    },

    /* SHIPPING */

    trackingNumber: {
      type: String,
      default: "",
    },

    shippingCarrier: {
      type: String,
      default: "",
    },

    /* ADMIN NOTES */

    adminNotes: {
      type: String,
      default: "",
    },

    cancelReason: {
      type: String,
      default: "",
    },

    /* DATES */

    paidAt: Date,

    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

/*iNDEXES*/

orderSchema.index({ createdAt: -1 });


/*MODEl*/

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

export default Order;
