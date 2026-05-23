import Order from "../../models/orderModel.js";

export const getOrderAnalytics =
  async (
    startDate,
    endDate
  ) => {
    const [
      totalOrders,
      cancelledOrders,
      statusBreakdown,
      recentOrders,
    ] =
      await Promise.all([
        Order.countDocuments({
          createdAt: {
            $gte:
              startDate,
            $lte:
              endDate,
          },
        }),

        Order.countDocuments({
          orderStatus:
            "CANCELLED",
          createdAt: {
            $gte:
              startDate,
            $lte:
              endDate,
          },
        }),

        Order.aggregate([
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
            $group: {
              _id:
                "$orderStatus",
              count: {
                $sum: 1,
              },
            },
          },
        ]),

        Order.find({
          createdAt: {
            $gte:
              startDate,
            $lte:
              endDate,
          },
        })
          .sort({
            createdAt:
              -1,
          })
          .limit(5),
      ]);

    return {
      totalOrders,
      cancelledOrders,
      orderStatus:
        statusBreakdown.map(
          (item) => ({
            name: item._id,
            value:
              item.count,
          })
        ),
      recentOrders,
    };
  };
