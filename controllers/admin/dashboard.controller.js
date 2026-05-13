import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/UserModel.js";

export const getDashboardData = async (req, res) => {
  try {


const { range, from, to } = req.query;

const now = new Date();

let startDate;
let endDate = now;

if (from && to) {
  startDate = new Date(from);
  endDate = new Date(to);

  /* START OF DAY */

startDate.setHours(
  0,
  0,
  0,
  0
);

/* END OF DAY */

endDate.setHours(
  23,
  59,
  59,
  999
);

} else {
  startDate = new Date();

  switch (range) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;

    case "15d":
      startDate.setDate(now.getDate() - 15);
      break;

    case "1m":
      startDate.setMonth(now.getMonth() - 1);
      break;

    case "3m":
      startDate.setMonth(now.getMonth() - 3);
      break;

    case "6m":
      startDate.setMonth(now.getMonth() - 6);
      break;

    default:
      startDate.setMonth(now.getMonth() - 12);
  }
}




const diffInDays =
  Math.ceil(
    (endDate - startDate) /
      (1000 * 60 * 60 * 24)
  );

let groupFormat;

if (diffInDays <= 31) {
  groupFormat = "%d %b";
} else if (diffInDays <= 365) {
  groupFormat = "%b";
} else {
  groupFormat = "%Y";
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

const revenueChart =
  await Order.aggregate([
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
          label: {
            $dateToString: {
  format: groupFormat,

  date: "$createdAt",

  timezone: "Asia/Kolkata",
}
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
        "_id.label": 1,
      },
    },
  ]);

const formattedRevenueChart =
  revenueChart.map((item) => ({
    label: item._id.label,

    revenue: item.revenue,

    orders: item.orders,
  }));


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
       revenueChart: formattedRevenueChart
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
