import Product from "../../models/productModel.js";

const formatLabel = (value = "") => {
  if (typeof value !== "string") return "";

  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

export const getNavigationOptions = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const [categories, collections, products] = await Promise.all([
      Product.distinct("category"),
      Product.distinct("styles"),
      Product.find(
        {
          status: "ACTIVE",
          ...(search && { name: { $regex: search, $options: "i" } }),
        },
        "_id name slug"
      )
        .sort({ name: 1 })
        .limit(50), // never return an unbounded list
    ]);

    res.status(200).json({
      success: true,

      data: {
        pages: [
          { id: "home", name: "Home" },
          { id: "products", name: "Products" },

        ],

        categories: categories
          .filter(
            (category) =>
              typeof category === "string" &&
              category.trim() !== ""
          )
          .sort()
          .map((category) => ({
            id: category,
            name: formatLabel(category),
          })),

        collections: collections
          .filter(
            (collection) =>
              typeof collection === "string" &&
              collection.trim() !== ""
          )
          .sort()
          .map((collection) => ({
            id: collection,
            name: formatLabel(collection),
          })),

        products: products
          .filter(
            (product) =>
              product.slug &&
              product.name
          )
          .map((product) => ({
            id: product.slug,
            name: product.name,
          })),
      },
    });
  } catch (error) {
    next(error);
  }
};
