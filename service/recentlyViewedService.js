import RecentlyViewed from "../models/recentlyViewedModel.js";
import Product from "../models/productModel.js";

const MAX_RECENT_PRODUCTS = 12;

const PRODUCT_SELECT_FIELDS = `
  name
  slug
  price
  originalPrice
  images
  category
  productType
  averageRating
  numReviews
  isBestSeller
  isNewProduct
`;

/**
 * Fetch products while preserving recently viewed order.
 */
async function getOrderedProducts(productIds) {
  if (!productIds.length) return [];

  const products = await Product.find({
    _id: { $in: productIds },
    status: "ACTIVE",
  })
    .select(PRODUCT_SELECT_FIELDS)
    .lean();

  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  return productIds
    .map((id) => productMap.get(id.toString()))
    .filter(Boolean);
}

/**
 * Add product to recently viewed.
 */
export async function saveRecentlyViewed(
  userId,
  productId
) {
  let recentlyViewed =
    await RecentlyViewed.findOne({
      user: userId,
    });

  if (!recentlyViewed) {
    recentlyViewed =
      await RecentlyViewed.create({
        user: userId,
        products: [],
      });
  }

  // Remove existing occurrence
  recentlyViewed.products =
    recentlyViewed.products.filter(
      (item) =>
        item.product.toString() !==
        productId.toString()
    );

  // Add newest product
  recentlyViewed.products.unshift({
    product: productId,
    viewedAt: new Date(),
  });

  // Keep latest N products
  recentlyViewed.products =
    recentlyViewed.products.slice(
      0,
      MAX_RECENT_PRODUCTS
    );

  await recentlyViewed.save();

  const productIds =
    recentlyViewed.products.map(
      (item) => item.product
    );

  return getOrderedProducts(productIds);
}

/**
 * Get recently viewed products.
 */
export async function getRecentlyViewed(
  userId
) {
  const recentlyViewed =
    await RecentlyViewed.findOne({
      user: userId,
    }).lean();

  if (!recentlyViewed) {
    return [];
  }

  const productIds =
    recentlyViewed.products.map(
      (item) => item.product
    );

  return getOrderedProducts(productIds);
}

/**
 * Clear recently viewed history.
 */
export async function clearRecentlyViewed(
  userId
) {
  await RecentlyViewed.findOneAndUpdate(
    {
      user: userId,
    },
    {
      products: [],
    }
  );

  return [];
}

/**
 * Merge guest history after login.
 *
 * guestProductIds = [
 *   "687...",
 *   "688..."
 * ]
 */
export async function mergeRecentlyViewed(
  userId,
  guestProductIds = []
) {
  if (!guestProductIds.length) {
    return getRecentlyViewed(userId);
  }

  let recentlyViewed =
    await RecentlyViewed.findOne({
      user: userId,
    });

  if (!recentlyViewed) {
    recentlyViewed =
      await RecentlyViewed.create({
        user: userId,
        products: [],
      });
  }

  // Merge guest products (latest first)
  for (const productId of [...guestProductIds].reverse()) {
    recentlyViewed.products =
      recentlyViewed.products.filter(
        (item) =>
          item.product.toString() !==
          productId.toString()
      );

    recentlyViewed.products.unshift({
      product: productId,
      viewedAt: new Date(),
    });
  }

  recentlyViewed.products =
    recentlyViewed.products.slice(
      0,
      MAX_RECENT_PRODUCTS
    );

  await recentlyViewed.save();

  const productIds =
    recentlyViewed.products.map(
      (item) => item.product
    );

  return getOrderedProducts(productIds);
}
