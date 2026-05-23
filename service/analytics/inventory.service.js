import Product from "../../models/productModel.js";

export const getInventoryAnalytics =
  async () => {
    const products =
      await Product.find();

    let lowStock = 0;
    let outOfStock = 0;
    let healthyStock = 0;

    for (const product of products) {
      if (
        product.stock === 0
      ) {
        outOfStock++;
      } else if (
        product.stock <=
        product.lowStockThreshold
      ) {
        lowStock++;
      } else {
        healthyStock++;
      }
    }

    return {
      totalProducts:
        products.length,
      lowStock,
      outOfStock,
      healthyStock,
    };
  };
