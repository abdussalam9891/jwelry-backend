import Order from "../../models/orderModel.js";

export const getGeoRevenue = async (
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
      $group: {
        _id: {
          city: {
            $toUpper: {
              $trim: {
                input: "$shippingAddress.city",
              },
            },
          },

          state: {
            $toUpper: {
              $trim: {
                input: "$shippingAddress.state",
              },
            },
          },
        },

        revenue: {
          $sum: "$totalPrice",
        },

        orders: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        revenue: -1,
      },
    },

    {
      $limit: 6,
    },

    {
      $project: {
        city: "$_id.city",

        state: "$_id.state",

        location: {
          $concat: [
            "$_id.city",
            ", ",
            "$_id.state",
          ],
        },

        revenue: 1,

        orders: 1,

        _id: 0,
      },
    },
  ]);
};
