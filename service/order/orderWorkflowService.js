import {
  getValidatedCart,
  buildOrderItems,
  clearCart,
} from "./cartService.js";

import {
  checkStock,
  deductStock,
} from "./inventoryService.js";

import {
  validateCoupon,
  redeemCoupon,
} from "./couponService.js";

import {
  calculatePricing,
} from "./pricingService.js";

import {
  createOrder,
} from "./orderService.js";

import {
  createRazorpayOrder,
  verifyPaymentSignature,
  finalizeCODOrder,
  finalizeOnlinePayment,
  markPaymentFailed,
} from "./paymentService.js";

import {
  sendOrderStatus,
} from "./emailService.js";

import {
  notifyNewOrder,
} from "./notificationService.js";



export async function processCheckout(checkoutContext) {
  /* CART / BUY NOW */

  if (checkoutContext.buyNow) {
    await getValidatedBuyNow(checkoutContext);
  } else {
    await getValidatedCart(checkoutContext);
  }

  /* STOCK */

  await checkStock(checkoutContext);

  /* BUILD ORDER ITEMS */

  buildOrderItems(checkoutContext);

  /* VALIDATE COUPON */

  await validateCoupon(checkoutContext);

  /* CALCULATE FINAL PRICING */

  checkoutContext.pricing =
    calculatePricing(checkoutContext);

  /* CREATE ORDER */

  await createOrder(checkoutContext);

  /* COD FLOW */

  if (checkoutContext.paymentMethod === "COD") {
    await finalizeCODOrder(checkoutContext);

    await redeemCoupon(checkoutContext);

    await deductStock(checkoutContext);

    if (!checkoutContext.buyNow) {
      await clearCart(checkoutContext);
    }

    await sendOrderStatus(
      checkoutContext,
      "PLACED"
    );

    await notifyNewOrder(checkoutContext);

    return {
      order: checkoutContext.order,
      pricing: checkoutContext.pricing,
    };
  }

  /* ONLINE PAYMENT */

  await createRazorpayOrder(checkoutContext);

  return {
    order: checkoutContext.order,

    pricing: checkoutContext.pricing,

    razorpayOrder:
      checkoutContext.razorpayOrder,

    key: process.env.RAZORPAY_KEY_ID,
  };
}



export async function completeCheckout(
  checkoutContext
) {
  const verified =
    verifyPaymentSignature(
      checkoutContext
    );

  if (!verified) {
    await markPaymentFailed(
      checkoutContext
    );

    throw new Error(
      "Payment verification failed"
    );
  }

  await finalizeOnlinePayment(
    checkoutContext
  );

  await redeemCoupon(
    checkoutContext
  );



 await deductStock(checkoutContext);

if (!checkoutContext.buyNow) {
  await clearCart(checkoutContext);
}

await sendOrderStatus(
  checkoutContext,
  "PLACED"
);

  await notifyNewOrder(
    checkoutContext
  );

  return checkoutContext.order;
}
