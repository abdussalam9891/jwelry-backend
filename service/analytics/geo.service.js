import Order from "../../models/orderModel.js";

export const getGeoRevenue =
  async (
    startDate,
    endDate
  ) => {
    return await Order.aggregate([
      {
        $match: {
          paymentStatus:
            "PAID",
          createdAt: {
            $gte:
              startDate,
            $lte:
              endDate,
          },
        },
      },
      {
        $group: {
          _id:
            "$shippingAddress.city",
          revenue: {
            $sum:
              "$totalPrice",
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
        $limit: 6,
      },
      {
        $project: {
          city:
            "$_id",
          revenue: 1,
          _id: 0,
        },
      },
    ]);
  };
