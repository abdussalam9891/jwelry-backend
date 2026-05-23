import Order from "../../models/orderModel.js";

export const getPaymentAnalytics =
  async (
    startDate,
    endDate
  ) => {
    const payments =
      await Order.aggregate([
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
              "$paymentMethod",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const total =
      payments.reduce(
        (
          acc,
          item
        ) =>
          acc +
          item.count,
        0
      );

    return payments.map(
      (item) => ({
        name: item._id,
        value:
          total
            ? Math.round(
                (
                  item.count /
                  total
                ) *
                  100
              )
            : 0,
      })
    );
  };
