import mongoose from "mongoose";

import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";

export const getProductDetails =
  async (req, res) => {

    try {

      const { id } = req.params;

      /*
        ==========================================
        VALIDATION
        ==========================================
      */

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid product id",
        });

      }

      /*
        ==========================================
        PRODUCT
        ==========================================
      */

      const product =
        await Product.findById(id);

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      /*
        ==========================================
        ORDERS CONTAINING PRODUCT
        ==========================================
      */

      const orders =
        await Order.find({
          "items.product": id,
        })
          .sort({
            createdAt: -1,
          });

          /*
  ==========================================
  ANALYTICS
  ==========================================
*/

let totalUnitsSold = 0;

let totalRevenue = 0;

/*
  ==========================================
  VARIANT MAP
  BUILD FROM PRODUCT FIRST
  ==========================================
*/

const variantMap = {};

/*
  ALWAYS SHOW INVENTORY
*/

if (
  product.variants?.length > 0
) {

  product.variants.forEach(
    (variant) => {

      const key =
        variant.sku ||
        "default";

      variantMap[key] = {

        sku:
          variant.sku || "-",

        material:
          variant.material || "-",

        size:
          variant.size || "-",

        stock:
          variant.stock || 0,

        price:
          variant.price || 0,

        sold: 0,

        revenue: 0,

      };

    }
  );

}

/*
  ==========================================
  ENRICH USING ORDERS
  ==========================================
*/

orders.forEach((order) => {

  order.items.forEach((item) => {

    if (
      item.product.toString() ===
      id
    ) {

      totalUnitsSold +=
        item.quantity;

      totalRevenue +=
        item.price *
        item.quantity;

      const key =
        item.variant?.sku ||
        "default";

      /*
        IF ORDER CONTAINS OLD
        UNKNOWN VARIANT
      */

      if (
        !variantMap[key]
      ) {

        variantMap[key] = {

          sku:
            item.variant?.sku ||
            "-",

          material:
            item.variant?.material ||
            "-",

          size:
            item.variant?.size ||
            "-",

          stock: 0,

          price:
            item.price || 0,

          sold: 0,

          revenue: 0,

        };

      }

      variantMap[key].sold +=
        item.quantity;

      variantMap[key].revenue +=
        item.price *
        item.quantity;

    }

  });

});

    

      /*
        ==========================================
        LOW STOCK
        ==========================================
      */

      const lowStockVariants =
        Object.values(
          variantMap
        ).filter(
          (variant) =>
            variant.stock <=
            product.lowStockThreshold
        );

      /*
        ==========================================
        RECENT ORDERS
        ==========================================
      */

      const recentOrders =
        orders
          .slice(0, 5)
          .map((order) => ({

            _id:
              order._id,

            orderNumber:
              order.orderNumber,

            customerName:
              order.customerName,

            customerEmail:
              order.customerEmail,

            totalPrice:
              order.totalPrice,

            orderStatus:
              order.orderStatus,

            paymentStatus:
              order.paymentStatus,

            createdAt:
              order.createdAt,

          }));

      /*
        ==========================================
        REVENUE CHART
        ==========================================
      */

      const revenueChart =
        await Order.aggregate([

          {
            $match: {
              "items.product":
                new mongoose.Types.ObjectId(
                  id
                ),
            },
          },

          {
            $unwind:
              "$items",
          },

          {
            $match: {
              "items.product":
                new mongoose.Types.ObjectId(
                  id
                ),
            },
          },

          {
            $group: {

              _id: {

                month: {
                  $month:
                    "$createdAt",
                },

              },

              revenue: {

                $sum: {

                  $multiply: [
                    "$items.price",
                    "$items.quantity",
                  ],

                },

              },

              unitsSold: {
                $sum:
                  "$items.quantity",
              },

            },

          },

          {
            $sort: {
              "_id.month": 1,
            },
          },

        ]);

      /*
        ==========================================
        RESPONSE
        ==========================================
      */

      res.json({

        product,

        analytics: {

          totalRevenue,

          totalUnitsSold,

          totalOrders:
            orders.length,

          lowStockCount:
            lowStockVariants.length,

        },

        variants:
          Object.values(
            variantMap
          ),

        lowStockVariants,

        recentOrders,

        revenueChart,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };
