import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/UserModel.js";

export const getDashboardData = async (req, res) => {
  try {


     const range =
  req.query.range || "12m";



  const now = new Date();

let startDate =
  new Date();

switch (range) {

  case "7d":

    startDate.setDate(
      now.getDate() - 7
    );

    break;

  case "15d":

    startDate.setDate(
      now.getDate() - 15
    );

    break;

  case "1m":

    startDate.setMonth(
      now.getMonth() - 1
    );

    break;

  case "3m":

    startDate.setMonth(
      now.getMonth() - 3
    );

    break;

  case "6m":

    startDate.setMonth(
      now.getMonth() - 6
    );

    break;

  default:

    startDate.setMonth(
      now.getMonth() - 12
    );

}




    /* TOTAL REVENUE */

   const revenuePromise =
  Order.aggregate([

    {
      $match: {

        paymentStatus:
          "PAID",

        createdAt: {
          $gte:
            startDate,
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

  ]);

    /* PARALLEL QUERIES */

    const [
      revenueResult,

      totalOrders,

      pendingOrders,

      totalCustomers,

      totalProducts,

      products,

      recentOrders,

      recentCustomers,
    ] = await Promise.all([
      revenuePromise,

      /* TOTAL ORDERS */

      Order.countDocuments(),

      /* PENDING ORDERS */

      Order.countDocuments({
        orderStatus: "PLACED",
      }),

      /* TOTAL CUSTOMERS */

      User.countDocuments({
        role: "user",
      }),

      /* TOTAL PRODUCTS */

      Product.countDocuments(),

      /* PRODUCTS */

      Product.find().select(
        `
    name
    images
    category
    stock
    variants
    lowStockThreshold
  `,
      ),

      /* RECENT ORDERS */

      Order.find()

        .sort({
          createdAt: -1,
        })

        .limit(5).select(`
            orderNumber
            customerName
            customerEmail
            totalPrice
            orderStatus
            paymentStatus
            createdAt
          `),

      /* RECENT CUSTOMERS */

      User.find({
        role: "user",
      })

        .sort({
          createdAt: -1,
        })

        .limit(5).select(`
            name
            email
            createdAt
            avatar
          `),
    ]);

    /* REVENUE */

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    /* LOW STOCK */

    const lowStockProducts = products.filter((product) => {
      const totalStock =
        product.variants?.length > 0
          ? product.variants.reduce(
              (acc, variant) => acc + variant.stock,

              0,
            )
          : product.stock;

      return totalStock > 0 && totalStock <= product.lowStockThreshold;
    });



    /* MONTHLY REVENUE */

const monthlyRevenue =
  await Order.aggregate([

    {
      $match: {
        paymentStatus: "PAID",
      },
    },

    {
      $group: {

        _id: {
          month: {
            $month: "$createdAt",
          },
        },

        revenue: {
          $sum: "$totalPrice",
        },

      },
    },

    {
      $sort: {
        "_id.month": 1,
      },
    },

  ]);





    /* RESPONSE */

    res.json({
      metrics: {
        totalRevenue,


        totalOrders,

        pendingOrders,

        totalCustomers,

        totalProducts,

        lowStockProducts: lowStockProducts.length,
      },

      lowStockProducts,

      recentOrders,

      recentCustomers,
       monthlyRevenue,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
