import Order from "../../models/orderModel.js";

export const getCategoryAnalytics = async (
  startDate,
  endDate
) => {
  return await Order.aggregate([
    {
      $match: {
        paymentStatus: "PAID",

        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $unwind: "$items",
    },

    {
      $lookup: {
        from: "products",

        localField: "items.product",

        foreignField: "_id",

        as: "product",
      },
    },

    {
      $unwind: "$product",
    },

    {
      $group: {
        _id: "$product.category",

        revenue: {
          $sum: {
            $multiply: [
              "$items.price",
              "$items.quantity",
            ],
          },
        },

        sold: {
          $sum: "$items.quantity",
        },
      },
    },

    {
      $sort: {
        revenue: -1,
      },
    },

    {
      $project: {
        category: "$_id",

        revenue: 1,

        sold: 1,

        _id: 0,
      },
    },
  ]);
};
