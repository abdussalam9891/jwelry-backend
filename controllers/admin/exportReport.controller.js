import ExcelJS from "exceljs";

import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/UserModel.js";

export const exportDashboardReport =
  async (req, res) => {

    try {

      /* FETCH DATA */

      const [
        orders,
        products,
        customers,
      ] = await Promise.all([

        Order.find()
          .sort({ createdAt: -1 })
          .limit(20),

        Product.find(),

        User.find({
          role: "user",
        }).limit(20),

      ]);

      /* METRICS */

      const totalRevenue =
        orders.reduce(
          (acc, order) =>
            acc + order.totalPrice,
          0
        );

      const totalOrders =
        orders.length;

      const totalCustomers =
        customers.length;

      const avgOrderValue =
        totalOrders > 0
          ? totalRevenue /
            totalOrders
          : 0;

      /* WORKBOOK */

      const workbook =
        new ExcelJS.Workbook();

      workbook.creator =
        "Gemora Admin";

      workbook.created =
        new Date();

      /*
        =================================================
        SUMMARY SHEET
        =================================================
      */

      const summarySheet =
        workbook.addWorksheet(
          "Dashboard Summary"
        );

      summarySheet.columns = [

        {
          header: "Metric",
          key: "metric",
          width: 30,
        },

        {
          header: "Value",
          key: "value",
          width: 25,
        },

      ];

      summarySheet.addRows([
        {
          metric:
            "Total Revenue",

          value:
            `₹${totalRevenue.toLocaleString()}`,
        },

        {
          metric:
            "Total Orders",

          value:
            totalOrders,
        },

        {
          metric:
            "Total Customers",

          value:
            totalCustomers,
        },

        {
          metric:
            "Average Order Value",

          value:
            `₹${Math.round(
              avgOrderValue
            ).toLocaleString()}`,
        },

        {
          metric:
            "Generated At",

          value:
            new Date()
              .toLocaleString(
                "en-IN",
                {
                  timeZone:
                    "Asia/Kolkata",
                }
              ),
        },

      ]);

      /*
        =================================================
        ORDERS SHEET
        =================================================
      */

      const ordersSheet =
        workbook.addWorksheet(
          "Orders"
        );

      ordersSheet.columns = [

        {
          header: "Order ID",
          key: "orderId",
          width: 28,
        },

        {
          header: "Customer",
          key: "customer",
          width: 28,
        },

        {
          header: "Amount",
          key: "amount",
          width: 18,
        },

        {
          header: "Payment",
          key: "payment",
          width: 18,
        },

        {
          header: "Status",
          key: "status",
          width: 18,
        },

        {
          header: "Date",
          key: "date",
          width: 22,
        },
        {
  header: "Variant",
  key: "variant",
  width: 25,
},

{
  header: "SKU",
  key: "sku",
  width: 22,
},

      ];



        orders.forEach((order) => {

  order.items.forEach(
    (item) => {

      ordersSheet.addRow({

        orderId:
          order.orderNumber,

        customer:
          order.customerName,

        product:
          item.name,

        variant:
          `
${item.variant?.material || ""}
${item.variant?.size
  ? ` / ${item.variant.size}`
  : ""}
          `.trim(),

        sku:
          item.variant?.sku || "-",

        quantity:
          item.quantity,

        price:
          `₹${item.price.toLocaleString()}`,

        total:
          `₹${(
            item.price *
            item.quantity
          ).toLocaleString()}`,

        payment:
          order.paymentStatus,

        status:
          order.orderStatus,

        date:
          new Date(
            order.createdAt
          ).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",

              month: "short",

              year: "numeric",

              timeZone:
                "Asia/Kolkata",
            }
          ),

      });

    }
  );

});



      /*
        =================================================
        PRODUCTS SHEET
        =================================================
      */

      const productsSheet =
        workbook.addWorksheet(
          "Inventory"
        );

      productsSheet.columns = [

        {
          header: "Product",
          key: "product",
          width: 35,
        },

        {
          header: "Category",
          key: "category",
          width: 20,
        },

        {
          header: "Stock",
          key: "stock",
          width: 15,
        },

      ];

      products.forEach((product) => {

        productsSheet.addRow({

          product:
            product.name,

          category:
            product.category,

          stock:
            product.stock,

        });

      });

      /*
        =================================================
        CUSTOMERS SHEET
        =================================================
      */

      const customersSheet =
        workbook.addWorksheet(
          "Customers"
        );

      customersSheet.columns = [

        {
          header: "Customer",
          key: "customer",
          width: 30,
        },

        {
          header: "Email",
          key: "email",
          width: 35,
        },

        {
          header: "Joined",
          key: "joined",
          width: 20,
        },

      ];

      customers.forEach((customer) => {

        customersSheet.addRow({

          customer:
            customer.name,

          email:
            customer.email,

          joined:
            new Date(
              customer.createdAt
            ).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",

                timeZone:
                  "Asia/Kolkata",
              }
            ),

        });

      });

      /*
        =================================================
        GLOBAL STYLING
        =================================================
      */

      workbook.eachSheet(
        (sheet) => {

          /* HEADER ROW */

          const headerRow =
            sheet.getRow(1);

          headerRow.font = {

            bold: true,

            color: {
              argb:
                "FFFFFFFF",
            },

          };

          headerRow.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {
              argb:
                "6B1A2A",
            },

          };

          headerRow.height = 24;

          /* ALIGNMENT */

          sheet.eachRow(
            (row) => {

              row.alignment = {

                vertical:
                  "middle",

              };

            }
          );

        }
      );

      /*
        =================================================
        RESPONSE
        =================================================
      */

      res.setHeader(
        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",

        `attachment; filename=gemora-dashboard-report.xlsx`
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Export failed",
      });

    }

  };
