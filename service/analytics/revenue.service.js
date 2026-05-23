import Order from "../../models/orderModel.js";
import { getGroupFormat } from "../../utils/admin/analytics/getGroupFormat.js";

export const getRevenueAnalytics = async (
  startDate,
  endDate
) => {
  const groupFormat =
    getGroupFormat(
      startDate,
      endDate
    );

  const [revenueResult, chart] =
    await Promise.all([
      Order.aggregate([
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
            _id: null,
            totalRevenue: {
              $sum:
                "$totalPrice",
            },
          },
        },
      ]),

      Order.aggregate([
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
            _id: {
              label: {
                $dateToString:
                  {
                    format:
                      groupFormat,
                    date: "$createdAt",
                    timezone:
                      "Asia/Kolkata",
                  },
              },
            },
            revenue: {
              $sum:
                "$totalPrice",
            },
            orders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.label":
              1,
          },
        },
      ]),
    ]);

  return {
    totalRevenue:
      revenueResult[0]
        ?.totalRevenue ||
      0,

    revenueChart:
      chart.map(
        (item) => ({
          label:
            item._id
              .label,
          revenue:
            item.revenue,
          orders:
            item.orders,
        })
      ),
  };
};
