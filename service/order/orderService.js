import Order from "../../models/orderModel.js";

export async function createOrder(checkoutContext) {
  const {
    user,
    address,
    orderItems,
    pricing,
    paymentMethod,
  } = checkoutContext;

  const orderNumber =
    `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const order = await Order.create({
    /* USER */

    user: user._id,

    /* CUSTOMER */

    customerName: user.name,

    customerEmail:
      user.email ||
      address.email ||
      "",

    customerPhone:
      address.phone,

    /* ITEMS */

    items: orderItems,

    /* SHIPPING */

    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      pincode: address.pincode,
      state: address.state,
      city: address.city,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      landmark: address.landmark,
    },

    /* PAYMENT */

    paymentMethod,

    paymentStatus: "PENDING",

    orderStatus:
      paymentMethod === "COD"
        ? "PLACED"
        : "PENDING",

    /* PRICING */

    itemsPrice: pricing.subtotal,

    subtotalPrice: pricing.subtotal,

    shippingPrice: pricing.shipping,

    taxPrice: pricing.tax,

    discountAmount:
      pricing.discount,

    totalPrice: pricing.total,

    /* COUPON */

    coupon: pricing.coupon,

    /* ORDER */

    orderNumber,

    statusHistory: [
      {
        status:
          paymentMethod === "COD"
            ? "PLACED"
            : "PENDING",
      },
    ],
  });

  checkoutContext.order = order;

  return order;
}

export async function getOrderById({
  orderId,
  userId,
}) {
  return Order.findOne({
    _id: orderId,
    user: userId,
  });
}
export async function updateOrderStatus(
  checkoutContext
) {
  const {
    order,
    status,
  } = checkoutContext;

  order.orderStatus = status;

  order.statusHistory.push({
    status,
  });




}
