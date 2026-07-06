import Coupon from "../../models/couponModel.js";
import CouponRedemption from "../../models/couponRedemptionModel.js";
import Order from "../../models/orderModel.js";

/* VALIDATE COUPON */

export async function validateCoupon(checkoutContext) {
  const { couponCode, user } = checkoutContext;

  // No coupon applied
  if (!couponCode) {
    checkoutContext.coupon = null;
    checkoutContext.couponSnapshot = null;
    checkoutContext.discountAmount = 0;
    return;
  }

  // Cart / Buy Now subtotal before discount
  const subtotal = checkoutContext.itemsPrice;

  const coupon = await Coupon.findOne({
    code: couponCode.trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new Error("Invalid coupon");
  }

  // Start date
  if (coupon.startsAt && coupon.startsAt > new Date()) {
    throw new Error("Coupon not started yet");
  }

  // Expiry
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error("Coupon expired");
  }

  // Global usage limit
  if (
    coupon.usageLimit &&
    coupon.usageCount >= coupon.usageLimit
  ) {
    throw new Error("Coupon usage limit reached");
  }

  // Per user limit
  const userRedemptions =
    await CouponRedemption.countDocuments({
      coupon: coupon._id,
      user: user._id,
    });

  if (userRedemptions >= coupon.perUserLimit) {
    throw new Error("Coupon usage limit reached");
  }

  // First order only
  if (coupon.firstOrderOnly) {
    const previousOrder = await Order.exists({
      user: user._id,
    });

    if (previousOrder) {
      throw new Error(
        "Coupon valid only for first order"
      );
    }
  }

  // Minimum order value
  if (subtotal < coupon.minOrderAmount) {
    throw new Error(
      `Minimum order ₹${coupon.minOrderAmount}`
    );
  }

let discountAmount = 0;

switch (coupon.discountType) {
  case "PERCENTAGE":
    discountAmount =
      (subtotal * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(
        discountAmount,
        coupon.maxDiscountAmount
      );
    }
    break;

  case "FIXED":
    discountAmount = Math.min(
      coupon.discountValue,
      subtotal
    );
    break;

  default:
    throw new Error(
      "Invalid coupon type"
    );
}

  checkoutContext.coupon = coupon;

  checkoutContext.discountAmount = discountAmount;

  checkoutContext.couponSnapshot = {
    couponId: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
  };
}

/* REDEEM COUPON */

export async function redeemCoupon(
  checkoutContext
) {
  const { order } =
    checkoutContext;

  if (
    !order.coupon?.couponId
  ) {
    return;
  }

  await CouponRedemption.create({
    coupon:
      order.coupon.couponId,

    user:
      order.user,

    order:
      order._id,

    discountAmount:
      order.coupon.discountAmount,
  });

  await Coupon.findByIdAndUpdate(
    order.coupon.couponId,
    {
      $inc: {
        usageCount: 1,
      },
    }
  );
}


