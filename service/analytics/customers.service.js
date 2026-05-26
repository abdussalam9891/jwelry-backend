import Order from "../../models/orderModel.js";

export const getCustomerAnalytics =
  async (
    startDate,
    endDate
  ) => {
    const [
      newCustomerEmails,
      repeatCustomers,
      recentCustomers,
    ] =
      await Promise.all([

        // NEW CUSTOMERS
        Order.distinct(
          "customerEmail",
          {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          }
        ),

        // REPEAT CUSTOMERS
        Order.aggregate([
          {
            $group: {
              _id: "$customerEmail",
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

        // RECENT CUSTOMERS
        Order.find({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        })
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(`
            customerName
            customerEmail
            createdAt
          `),
      ]);

    return {
      newCustomers:
        newCustomerEmails.length,

      repeatCustomers:
        repeatCustomers.length,

      recentCustomers,
    };
  };
