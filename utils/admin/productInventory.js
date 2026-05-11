export const getInventoryData =
  (product) => {

    const totalStock =
      product.variants?.length > 0

        ? product.variants.reduce(
            (acc, variant) =>

              acc +
              variant.stock,

            0
          )

        : product.stock;

    let inventoryStatus =
      "IN STOCK";

    if (totalStock === 0) {

      inventoryStatus =
        "OUT OF STOCK";

    }

    else if (
      totalStock <=
      product.lowStockThreshold
    ) {

      inventoryStatus =
        "LOW STOCK";

    }

    return {

      totalStock,

      inventoryStatus,

    };

  };
