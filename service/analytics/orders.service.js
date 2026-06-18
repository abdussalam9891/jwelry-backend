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

    /* ---------------- FUNNEL ---------------- */

    const statusMap = {
      PLACED: 0,
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    statusBreakdown.forEach(
      (item) => {
        statusMap[
          item._id
        ] =
          item.count;
      }
    );

    const funnel = [
      {
        stage:
          "PLACED",
        value:
          statusMap.PLACED,
      },

      {
        stage:
          "CONFIRMED",
        value:
          statusMap.CONFIRMED,
      },

      {
        stage:
          "SHIPPED",
        value:
          statusMap.SHIPPED,
      },

      {
        stage:
          "DELIVERED",
        value:
          statusMap.DELIVERED,
      },
    ];

    return {
      totalOrders,

      cancelledOrders,

      orderStatus:
        statusBreakdown.map(
          (item) => ({
            name:
              item._id,

            value:
              item.count,
          })
        ),

      funnel,

      recentOrders,
    };
  };
