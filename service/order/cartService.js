import Cart from "../../models/cartModel.js";
import { getPurchasableProduct } from "../../utils/productPurchase.js";

/* GET USER CART */

export async function getValidatedCart(
  checkoutContext
) {
  const cart = await Cart.findOne({
    user: checkoutContext.user._id,
  }).populate("items.product");

  if (!cart || !cart.items.length) {
    throw new Error("Cart is empty");
  }

  checkoutContext.cart = cart;

  return cart;
}







export async function getValidatedBuyNow(checkoutContext) {

  const preview =
    await getPurchasableProduct({

      productId:
        checkoutContext.buyNow.productId,

      variantId:
        checkoutContext.buyNow.variantId,

      quantity:
        checkoutContext.buyNow.quantity,

    });

  checkoutContext.cart = {

    items: [

      {

        product:
          preview.product,

        variantId:
          preview.variant?._id || null,

        quantity:
          preview.quantity,

      },

    ],

  };

  return checkoutContext;
}











/* BUILD ORDER SNAPSHOT */

export function buildOrderItems(
  checkoutContext
) {
  const orderItems = [];

  let itemsPrice = 0;

  const cart = checkoutContext.cart;

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error(
        "Product no longer exists"
      );
    }

    let finalPrice = product.price;

    let variantSnapshot = null;

    if (item.variantId) {
      const variant =
        product.variants.id(
          item.variantId
        );

      if (!variant) {
        throw new Error(
          "Variant not found"
        );
      }

      finalPrice = variant.price;

      variantSnapshot = {
        variantId: variant._id,
        sku: variant.sku,
        size: variant.size,
        material: variant.material,
      };
    }

    orderItems.push({
      product: product._id,
      slug: product.slug,
      name: product.name,
      image:
        product.images?.[0]?.url ||
        "",
      price: finalPrice,
      quantity: item.quantity,
      variant: variantSnapshot,
    });

    itemsPrice +=
      finalPrice * item.quantity;
  }

  checkoutContext.orderItems =
    orderItems;

  checkoutContext.itemsPrice =
    itemsPrice;

  return checkoutContext;
}

/* CLEAR CART */




export async function clearCart(
  checkoutContext
) {
  const { order } =
    checkoutContext;

  const cart =
    await Cart.findOne({
      user: order.user,
    });

  if (!cart) {
    return checkoutContext;
  }

  cart.items = [];

  await cart.save();

  return checkoutContext;
}
