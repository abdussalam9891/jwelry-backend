import Product from "../models/productModel.js";

export async function getPurchasableProduct({
  productId,
  variantId = null,
  quantity = 1,
}) {
  const qty = Number(quantity);

  if (!productId) {
    throw new Error("Product is required");
  }

  if (isNaN(qty) || qty < 1 || qty > 10) {
    throw new Error("Invalid quantity");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  let selectedVariant = null;

  let price = product.price;
  let originalPrice = product.originalPrice || product.price;
  let stock = product.stock;

  if (product.variants?.length) {
    if (!variantId) {
      throw new Error("Variant required");
    }

    selectedVariant = product.variants.id(variantId);

    if (!selectedVariant) {
      throw new Error("Invalid variant");
    }

    stock = selectedVariant.stock;
    price = selectedVariant.price;
    originalPrice = product.originalPrice || selectedVariant.price;
  }

  if (stock < qty) {
    throw new Error(`Only ${stock} item(s) available`);
  }

 return {
  product,
  variant: selectedVariant,

  quantity: qty,

  price,
  originalPrice,
  stock,

  item: {
    productId: product._id,

    variantId:
      selectedVariant?._id || null,

    name: product.name,

    slug: product.slug,

    image:
      product.images?.[0]?.url || null,

    quantity: qty,

    price,

    originalPrice,

    variantDetails: selectedVariant
      ? {
          material:
            selectedVariant.material,

          size:
            selectedVariant.size,

          sku:
            selectedVariant.sku,
        }
      : null,
  },

  summary: {
    subtotal: price * qty,

    savings:
      (originalPrice - price) * qty,

    shipping: 0,

    total: price * qty,
  },
};
}
