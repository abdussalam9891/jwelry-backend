import Product from "../../models/productModel.js";

export async function checkStock(checkoutContext) {
  const { cart } = checkoutContext;

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error("Product no longer exists");
    }

    let availableStock = product.stock;

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);

      if (!variant) {
        throw new Error("Variant not found");
      }

      availableStock = variant.stock;
    }

    if (item.quantity > availableStock) {
      throw new Error(`${product.name} is out of stock`);
    }
  }
}

export async function deductStock(checkoutContext) {
  const { order } = checkoutContext;

  for (const item of order.items) {
    const product = await Product.findById(item.product);

    if (!product) continue;

    if (item.variant?.variantId) {
      const variant = product.variants.id(item.variant.variantId);

      if (variant) {
        variant.stock -= item.quantity;
      }
    } else {
      product.stock -= item.quantity;
    }

    await product.save();
  }
}

export async function restoreStock(checkoutContext) {
  const { order } = checkoutContext;

  for (const item of order.items) {
    const product = await Product.findById(item.product);

    if (!product) continue;

    if (item.variant?.variantId) {
      const variant = product.variants.id(item.variant.variantId);

      if (variant) {
        variant.stock += item.quantity;
      }
    } else {
      product.stock += item.quantity;
    }

    await product.save();
  }
}
