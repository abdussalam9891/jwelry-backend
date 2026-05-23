import Order from "../../models/orderModel.js";
import User from "../../models/UserModel.js";

export const getCustomerAnalytics =
  async (
    startDate,
    endDate
  ) => {
    const [
      newCustomers,
      repeatCustomers,
      recentCustomers,
    ] =
      await Promise.all([
        User.countDocuments({
          role: "user",
          createdAt: {
            $gte:
              startDate,
            $lte:
              endDate,
          },
        }),

        Order.aggregate([
          {
            $group: {
              _id:
                "$user",
              orders: {
                $sum: 1,
              },
            },
          },
          {
            $match: {
              orders: {
                $gt: 1,
              },
            },
          },
        ]),

        User.find({
          role: "user",
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
      newCustomers,
      repeatCustomers:
        repeatCustomers.length,
      recentCustomers,
    };
  };
