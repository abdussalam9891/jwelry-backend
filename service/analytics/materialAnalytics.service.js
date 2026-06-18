import Order from "../../models/orderModel.js";

export const getMaterialAnalytics = async (
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
      $group: {
        _id: "$items.variant.material",

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
        material: "$_id",
        revenue: 1,
        sold: 1,
        _id: 0,
      },
    },
  ]);
};
