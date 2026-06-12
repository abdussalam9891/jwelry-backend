import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";


import {
  sendOrderStatusEmail,
} from "../../utils/sendOrderStatusEmail.js";

/* GET ALL ORDERS */

export const getAdminOrders =
  async (req, res) => {

    try {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      const search =
        req.query.search || "";

      const status =
        req.query.status || "";

      const sort =
        req.query.sort || "-createdAt";

      /* QUERY */

      const query = {};

      /* STATUS FILTER */

      if (status) {

        query.orderStatus =
          status;

      }

      /* SEARCH */

      if (search) {

        query.$or = [

          /* ORDER NUMBER */

          {
            orderNumber: {
              $regex: search,
              $options: "i",
            },
          },

          /* CUSTOMER NAME */

          {
            customerName: {
              $regex: search,
              $options: "i",
            },
          },

          /* CUSTOMER EMAIL */

          {
            customerEmail: {
              $regex: search,
              $options: "i",
            },
          },

          /* CUSTOMER PHONE */

          {
            customerPhone: {
              $regex: search,
              $options: "i",
            },
          },

          /* TRACKING */

          {
            trackingNumber: {
              $regex: search,
              $options: "i",
            },
          },

        ];

      }

      /* TOTAL */

      const totalOrders =
        await Order.countDocuments(
          query
        );

      const totalPages =
        Math.ceil(
          totalOrders / limit
        );

      /* FETCH */

      const orders =
        await Order.find(query)

          .populate(
            "user",
            "name email"
          )

          .sort(sort)

          .skip(skip)

          .limit(limit)

          .lean();

      /* RESPONSE */

      res.json({

        orders,

        pagination: {

          totalOrders,

          totalPages,

          currentPage: page,

          limit,

        },

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };



  /* DELETE ORDER */

export const deleteOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });

      }

      await order.deleteOne();

      res.json({
        message:
          "Order deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };


  /* GET ORDER STATS */

export const getOrderStats =
  async (req, res) => {

    try {

      const totalOrders =
        await Order.countDocuments();

      const processingOrders =
        await Order.countDocuments({
          orderStatus:
            "PLACED",
        });

      const shippedOrders =
        await Order.countDocuments({
          orderStatus:
            "SHIPPED",
        });

      const cancelledOrders =
        await Order.countDocuments({
          orderStatus:
            "CANCELLED",
        });

      res.json({

        totalOrders,

        processingOrders,

        shippedOrders,

        cancelledOrders,

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };





  /* GET SINGLE ORDER */

export const getSingleOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )

        .populate(
          "user",
          "name email"
        )

        .lean();



      if (!order) {

        return res
          .status(404)
          .json({

            message:
              "Order not found",

          });

      }



      res.json({
        order,
      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };


  /* UPDATE ORDER STATUS */


export const updateOrderStatus =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {
        orderStatus,
      } = req.body;

      const allowedStatuses = [

        "PLACED",

        "CONFIRMED",

        "SHIPPED",

        "DELIVERED",

        "CANCELLED",

      ];

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order status",

        });

      }

      const order =
        await Order.findById(id);

      if (!order) {

        return res.status(404).json({

          message:
            "Order not found",

        });

      }

      const previousStatus =
        order.orderStatus;

      // no-op update
      if (
        previousStatus ===
        orderStatus
      ) {

        return res.status(400).json({

          message:
            "Order already has this status",

        });

      }

      /*
        RESTORE INVENTORY
        ONLY FIRST TIME
        CANCELLED
      */

      if (

        previousStatus !==
          "CANCELLED" &&

        orderStatus ===
          "CANCELLED"

      ) {

        for (
          const item of order.items
        ) {

          const product =
            await Product.findById(
              item.product
            );

          if (!product)
            continue;

          const variant =
            product.variants.find(
              (v) =>
                v._id.toString() ===
                item.variant?.variantId?.toString()
            );

          if (variant) {

            variant.stock +=
              item.quantity;

          } else {

            product.stock +=
              item.quantity;

          }

          await product.save();

        }

      }

      /*
        UPDATE STATUS
      */

      order.orderStatus =
        orderStatus;

      if (
        orderStatus ===
        "DELIVERED"
      ) {

        order.deliveredAt =
          new Date();

      }

      order.statusHistory.push({

        status:
          orderStatus,

        changedAt:
          new Date(),

      });

      await order.save();

      /*
        SEND EMAIL
      */

      if (

        order.customerEmail &&

        order.customerEmail.trim()

      ) {

        try {

          await sendOrderStatusEmail({

            email:
              order.customerEmail,

            customerName:
              order.customerName,

            orderNumber:
              order.orderNumber,

            status:
              orderStatus,

          });

        } catch (err) {

          console.error(
            "Status email failed:",
            err
          );

        }

      }

      res.json({

        success: true,

        message:
          "Order status updated",

        order,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };




  /* UPDATE PAYMENT STATUS */

export const updatePaymentStatus =
  async (req, res) => {

    try {

      const {
        paymentStatus,
      } = req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });

      }

      order.paymentStatus =
        paymentStatus;

      /* AUTO PAID DATE */

      if (
        paymentStatus ===
        "PAID"
      ) {

        order.paidAt =
          new Date();

      }

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };



