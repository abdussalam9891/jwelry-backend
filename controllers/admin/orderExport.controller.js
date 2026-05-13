import ExcelJS from "exceljs";

import Order from "../../models/orderModel.js";

export const exportOrdersReport =
  async (req, res) => {

    try {

      /*
        ==========================================
        FETCH ORDERS
        ==========================================
      */

      const orders =
        await Order.find()
          .sort({
            createdAt: -1,
          });

      /*
        ==========================================
        WORKBOOK
        ==========================================
      */

      const workbook =
        new ExcelJS.Workbook();

      workbook.creator =
        "Gemora Admin";

      workbook.created =
        new Date();

      /*
        ==========================================
        SHEET
        ==========================================
      */

      const sheet =
        workbook.addWorksheet(
          "Orders Report"
        );

      /*
        ==========================================
        COLUMNS
        ==========================================
      */

      sheet.columns = [

        {
          header: "Order ID",
          key: "orderId",
          width: 22,
        },

        {
          header: "Order Date",
          key: "date",
          width: 18,
        },

        {
          header: "Customer",
          key: "customer",
          width: 25,
        },

        {
          header: "Email",
          key: "email",
          width: 35,
        },

        {
          header: "Phone",
          key: "phone",
          width: 20,
        },

        {
          header: "Product",
          key: "product",
          width: 35,
        },

        {
          header: "SKU",
          key: "sku",
          width: 25,
        },

        {
          header: "Material",
          key: "material",
          width: 18,
        },

        {
          header: "Size",
          key: "size",
          width: 15,
        },

        {
          header: "Quantity",
          key: "quantity",
          width: 15,
        },

        {
          header: "Price",
          key: "price",
          width: 18,
        },

        {
          header: "Total",
          key: "total",
          width: 18,
        },

        {
          header: "Payment Method",
          key: "paymentMethod",
          width: 20,
        },

        {
          header: "Payment Status",
          key: "paymentStatus",
          width: 20,
        },

        {
          header: "Order Status",
          key: "orderStatus",
          width: 20,
        },

        {
          header: "Address",
          key: "address",
          width: 40,
        },

        {
          header: "City",
          key: "city",
          width: 20,
        },

        {
          header: "State",
          key: "state",
          width: 20,
        },

        {
          header: "Pincode",
          key: "pincode",
          width: 15,
        },

        {
          header: "Carrier",
          key: "carrier",
          width: 20,
        },

        {
          header: "Tracking Number",
          key: "tracking",
          width: 28,
        },

      ];

  /*
  ==========================================
  ROWS
  ==========================================
*/

orders.forEach((order) => {

  /* SAFE ITEMS CHECK */

  if (
    !order.items ||
    !Array.isArray(order.items)
  ) {
    return;
  }

  order.items.forEach(
    (item) => {

      sheet.addRow({

        orderId:
          order.orderNumber || "-",

        date:
          order.createdAt
            ? new Date(
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
              )
            : "-",

        customer:
          order.customerName || "-",

        email:
          order.customerEmail || "-",

        phone:
          order.customerPhone || "-",

        product:
          item.name || "-",

        sku:
          item.variant?.sku || "-",

        material:
          item.variant
            ?.material || "-",

        size:
          item.variant
            ?.size || "-",

        quantity:
          item.quantity || 0,

        price:
          `₹${(
            item.price || 0
          ).toLocaleString()}`,

        total:
          `₹${(
            (item.price || 0) *
            (item.quantity || 0)
          ).toLocaleString()}`,

        paymentMethod:
          order.paymentMethod || "-",

        paymentStatus:
          order.paymentStatus || "-",

        orderStatus:
          order.orderStatus || "-",

        address:
          `
${order.shippingAddress?.addressLine1 || ""}
${order.shippingAddress?.addressLine2
  ? `, ${order.shippingAddress.addressLine2}`
  : ""}
          `.trim() || "-",

        city:
          order.shippingAddress
            ?.city || "-",

        state:
          order.shippingAddress
            ?.state || "-",

        pincode:
          order.shippingAddress
            ?.pincode || "-",

        carrier:
          order.shippingCarrier || "-",

        tracking:
          order.trackingNumber || "-",

      });

    }
  );

});

      /*
        ==========================================
        HEADER STYLE
        ==========================================
      */

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

      /*
        ==========================================
        ROW ALIGNMENT
        ==========================================
      */

      sheet.eachRow((row) => {

        row.alignment = {

          vertical:
            "middle",

        };

      });

      /*
        ==========================================
        RESPONSE
        ==========================================
      */

      res.setHeader(
        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",

        "attachment; filename=orders-report.xlsx"
      );



      console.log(
  "WRITING EXCEL FILE..."
);



      await workbook.xlsx.write(res);

      console.log(
  "EXCEL SENT"
);

return res.end();


    } catch (error) {

  console.error(
    "ORDER EXPORT ERROR:"
  );

  console.error(error);

  console.error(error.stack);

  res.status(500).json({
    message:
      error.message,
  });

}

  };
