import Razorpay from "razorpay";
import crypto from "crypto";

import {
  updateOrderStatus,
} from "./orderService.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



export async function createRazorpayOrder(
  checkoutContext
) {
  const { order } = checkoutContext;

  const razorpayOrder =
    await razorpay.orders.create({
      amount: Math.round(
        order.totalPrice * 100
      ),
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
      },
    });

  checkoutContext.razorpayOrder =
    razorpayOrder;

  order.paymentGatewayOrderId =
    razorpayOrder.id;

  await order.save();

  return razorpayOrder;
}



export function verifyPaymentSignature(
  checkoutContext
) {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = checkoutContext;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env
          .RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpayOrderId}|${razorpayPaymentId}`
      )
      .digest("hex");

  return (
    expectedSignature ===
    razorpaySignature
  );
}



export async function finalizeCODOrder(
  checkoutContext
) {
  const { order } =
    checkoutContext;



 

  /**
   * COD isn't paid yet.
   * Payment remains pending until delivery.
   */

  order.paymentStatus =
    "PENDING";

  await order.save();

  return order;
}



export async function finalizeOnlinePayment(
  checkoutContext
) {
  const {
    order,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = checkoutContext;

    checkoutContext.status =
    "PLACED";

  await updateOrderStatus(
    checkoutContext
  );

  order.paymentStatus =
    "PAID";

  order.paymentGatewayOrderId =
    razorpayOrderId;

  order.paymentGatewayPaymentId =
    razorpayPaymentId;

  order.paymentGatewaySignature =
    razorpaySignature;

  order.paidAt =
    new Date();



    // update order status would handle it
  // order.statusHistory.push({
  //   status: "PLACED",
  // });

  await order.save();

  return order;
}



export async function markPaymentFailed(
  checkoutContext
) {
  const { order } =
    checkoutContext;

  order.paymentStatus =
    "FAILED";

  order.paymentAttempts += 1;

  await order.save();

  return order;
}
