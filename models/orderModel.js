import mongoose from "mongoose";

const orderItemSchema =
  new mongoose.Schema({

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // 🔥 snapshot data
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

  });




const shippingAddressSchema =
  new mongoose.Schema({

    fullName: {
      type: String,
      required: true,
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

  });




const orderSchema =
  new mongoose.Schema({

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

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

      enum: [
        "COD",
        "RAZORPAY",
      ],

      default: "COD",

    },



    itemsPrice: {

      type: Number,

      required: true,

      default: 0,

    },



    shippingPrice: {

      type: Number,

      default: 0,

    },



    totalPrice: {

      type: Number,

      required: true,

      default: 0,

    },



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

    },



    isPaid: {

      type: Boolean,

      default: false,

    },



    paidAt: Date,



    deliveredAt: Date,

  },

  {

    timestamps: true,

  });




const Order =
  mongoose.model(
    "Order",
    orderSchema
  );

export default Order;
