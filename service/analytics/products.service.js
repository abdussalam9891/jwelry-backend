import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

export const getTopProducts =
  async (
    startDate,
    endDate
  ) => {
    return await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte:
              startDate,
            $lte:
              endDate,
          },
        },
      },
      {
        $unwind:
          "$items",
      },
      {
        $group: {
          _id:
            "$items.product",
          revenue: {
            $sum: {
              $multiply:
                [
                  "$items.price",
                  "$items.quantity",
                ],
            },
          },
          sold: {
            $sum:
              "$items.quantity",
          },
        },
      },
      {
        $sort: {
          revenue:
            -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from:
            "products",
          localField:
            "_id",
          foreignField:
            "_id",
          as:
            "product",
        },
      },
      {
        $unwind:
          "$product",
      },
      {
        $project: {
          name:
            "$product.name",
          sku: "$product.sku",
          stock:
            "$product.stock",
          revenue: 1,
          sold: 1,
        },
      },
    ]);
  };
