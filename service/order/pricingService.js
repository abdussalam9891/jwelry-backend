export function calculatePricing(
  checkoutContext
) {
  const itemsPrice =
    checkoutContext.itemsPrice || 0;

  const shippingPrice =
    checkoutContext.shippingPrice || 0;

  const taxPrice =
    checkoutContext.taxPrice || 0;

  const discountAmount =
    checkoutContext.discountAmount || 0;

  const platformFee =
    checkoutContext.platformFee || 0;

  const giftWrapCharge =
    checkoutContext.giftWrapCharge || 0;

  const insuranceCharge =
    checkoutContext.insuranceCharge || 0;

  const subtotalPrice =
    itemsPrice;

  const totalPrice = Math.max(
    0,
    subtotalPrice -
      discountAmount +
      shippingPrice +
      taxPrice +
      platformFee +
      giftWrapCharge +
      insuranceCharge
  );

  checkoutContext.pricing = {
    itemsPrice,
    subtotalPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    platformFee,
    giftWrapCharge,
    insuranceCharge,
    totalPrice,
  };
}
