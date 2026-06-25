import {
  getOrderById,
} from "../service/order/orderService.js";

import {
  completeCheckout,
} from "../service/order/orderWorkflowService.js";

import {
  markPaymentFailed,
} from "../service/order/paymentService.js";

/* GET CONFIG */

export function getRazorpayConfig(
  req,
  res
) {
  return res.json({
    success: true,
    key:
      process.env.RAZORPAY_KEY_ID,
  });
}

/* VERIFY PAYMENT */

export async function verifyPayment(
  req,
  res
) {
  try {

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const order =
      await getOrderById({
        orderId,
        userId:
          req.user._id,
      });

    if (!order) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Order not found",
        });
    }

    const checkoutContext = {
      order,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };

    await completeCheckout(
      checkoutContext
    );

    return res.json({
      success: true,
      order:
        checkoutContext.order,
    });

  } catch (error) {

    console.error(error);

    return res
      .status(400)
      .json({
        success: false,
        message:
          error.message,
      });

  }
}

/* PAYMENT FAILED */

export async function paymentFailed(
  req,
  res
) {
  try {

    const { orderId } =
      req.body;

    const order =
      await getOrderById({
        orderId,
        userId:
          req.user._id,
      });

    if (!order) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Order not found",
        });
    }

    await markPaymentFailed({
      order,
    });

    return res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return res
      .status(400)
      .json({
        success: false,
        message:
          error.message,
      });

  }
}

 