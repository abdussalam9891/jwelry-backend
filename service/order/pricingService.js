export function calculatePricing(checkoutContext) {
  const {
    itemsPrice = 0,
    savings = 0,
    shippingPrice = 0,
    taxPrice = 0,
    discountAmount = 0,
    platformFee = 0,
    giftWrapCharge = 0,
    insuranceCharge = 0,
    itemCount = 0,
    couponSnapshot = null,
  } = checkoutContext;

  const total = Math.max(
    0,
    itemsPrice -
      discountAmount +
      shippingPrice +
      taxPrice +
      platformFee +
      giftWrapCharge +
      insuranceCharge
  );

  return {
    subtotal: itemsPrice,
    savings,
    shipping: shippingPrice,
    tax: taxPrice,
    discount: discountAmount,
    platformFee,
    giftWrap: giftWrapCharge,
    insurance: insuranceCharge,
    itemCount,
    coupon: couponSnapshot,
    total,
  };
}























































// export function calculatePricing(checkoutContext) {
//   const subtotal = checkoutContext.itemsPrice || 0;

//   const savings = checkoutContext.savings || 0;

//   const shipping = checkoutContext.shippingPrice || 0;

//   const tax = checkoutContext.taxPrice || 0;

//   const discount = checkoutContext.discountAmount || 0;

//   const platformFee =
//     checkoutContext.platformFee || 0;

//   const giftWrap =
//     checkoutContext.giftWrapCharge || 0;

//   const insurance =
//     checkoutContext.insuranceCharge || 0;

//   const itemCount =
//     checkoutContext.itemCount || 0;

//   const coupon =
//     checkoutContext.couponSnapshot || null;

//   const total = Math.max(
//     0,
//     subtotal -
//       discount +
//       shipping +
//       tax +
//       platformFee +
//       giftWrap +
//       insurance
//   );

//   return {
//     subtotal,

//     savings,

//     shipping,

//     tax,

//     discount,

//     platformFee,

//     giftWrap,

//     insurance,

//     itemCount,

//     coupon,

//     total,
//   };
// }
