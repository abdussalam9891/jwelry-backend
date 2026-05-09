import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/UserModel.js";

export const getDashboardData = async (
  req,
  res
) => {

  try {


    // TOTAL REVENUE

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "PAID",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalPrice",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;


    // TOTAL ORDERS

    const totalOrders =
      await Order.countDocuments();


    // PENDING ORDERS

    const pendingOrders =
      await Order.countDocuments({
        fulfillmentStatus:
          "UNFULFILLED",
      });


    // TOTAL CUSTOMERS

    const totalCustomers =
      await User.countDocuments({
        role: "user",
      });


    // TOTAL PRODUCTS

    const totalProducts =
      await Product.countDocuments();


    // LOW STOCK PRODUCTS

    const products =
      await Product.find();

    const lowStockProducts =
      products.filter((product) => {

        const totalStock =
          product.variants?.length > 0
            ? product.variants.reduce(
                (acc, variant) =>
                  acc + variant.stock,
                0
              )
            : product.stock;

        return (
          totalStock > 0 &&
          totalStock <=
            product.lowStockThreshold
        );

      });


    // RECENT ORDERS

    const recentOrders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // RECENT CUSTOMERS

    const recentCustomers =
      await User.find({
        role: "user",
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "name email createdAt avatar"
        );


    // RESPONSE

    res.json({

      metrics: {

        totalRevenue,

        totalOrders,

        pendingOrders,

        totalCustomers,

        totalProducts,

        lowStockProducts:
          lowStockProducts.length,

      },

      lowStockProducts,

      recentOrders,

      recentCustomers,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
