import ExcelJS from "exceljs";

import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";

export const exportProductsReport =
  async (req, res) => {

    try {

      /*
        ==========================================
        FETCH DATA
        ==========================================
      */

      const [products, orders] =
        await Promise.all([

          Product.find(),

          Order.find({
            paymentStatus: "PAID",
          }),

        ]);

      /*
        ==========================================
        SALES ANALYTICS MAP
        ==========================================
      */

      const salesMap = {};

      orders.forEach((order) => {

        order.items.forEach(
          (item) => {

            const key = `
${item.name}-
${item.variant?.sku || "default"}
            `.trim();

            if (!salesMap[key]) {

              salesMap[key] = {

                sold: 0,

                revenue: 0,

              };

            }

            salesMap[key].sold +=
              item.quantity;

            salesMap[key].revenue +=
              item.price *
              item.quantity;

          }
        );

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
        PRODUCTS SHEET
        ==========================================
      */

      const sheet =
        workbook.addWorksheet(
          "Products Analytics"
        );

      /*
        ==========================================
        COLUMNS
        ==========================================
      */

      sheet.columns = [

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
          header: "SKU",
          key: "sku",
          width: 25,
        },

        {
          header: "Material",
          key: "material",
          width: 20,
        },

        {
          header: "Size",
          key: "size",
          width: 15,
        },

        {
          header: "Price",
          key: "price",
          width: 18,
        },

        {
          header: "Current Stock",
          key: "stock",
          width: 18,
        },

        {
          header: "Units Sold",
          key: "sold",
          width: 18,
        },

        {
          header: "Revenue",
          key: "revenue",
          width: 20,
        },

        {
          header: "Remaining",
          key: "remaining",
          width: 18,
        },

        {
          header: "Status",
          key: "status",
          width: 20,
        },

      ];

      /*
        ==========================================
        ROWS
        ==========================================
      */

      products.forEach(
        (product) => {

          /*
            ======================================
            VARIANT PRODUCTS
            ======================================
          */

          if (
            product.variants?.length > 0
          ) {

            product.variants.forEach(
              (variant) => {

                const key = `
${product.name}-${variant.sku}
                `.trim();

                const analytics =
                  salesMap[key] || {

                    sold: 0,

                    revenue: 0,

                  };

                let status =
                  "IN STOCK";

                if (
                  variant.stock <= 0
                ) {

                  status =
                    "OUT OF STOCK";

                }

                else if (
                  variant.stock <=
                  product.lowStockThreshold
                ) {

                  status =
                    "LOW STOCK";

                }

                sheet.addRow({

                  product:
                    product.name,

                  category:
                    product.category,

                  sku:
                    variant.sku,

                  material:
                    variant.material || "-",

                  size:
                    variant.size || "-",

                  price:
                    `₹${variant.price.toLocaleString()}`,

                  stock:
                    variant.stock,

                  sold:
                    analytics.sold,

                  revenue:
                    `₹${analytics.revenue.toLocaleString()}`,

                  remaining:
                    variant.stock,

                  status,

                });

              }
            );

          }

          /*
            ======================================
            SIMPLE PRODUCTS
            ======================================
          */

          else {

            const key = `
${product.name}-default
            `.trim();

            const analytics =
              salesMap[key] || {

                sold: 0,

                revenue: 0,

              };

            let status =
              "IN STOCK";

            if (
              product.stock <= 0
            ) {

              status =
                "OUT OF STOCK";

            }

            else if (
              product.stock <=
              product.lowStockThreshold
            ) {

              status =
                "LOW STOCK";

            }

            sheet.addRow({

              product:
                product.name,

              category:
                product.category,

              sku:
                product.sku || "-",

              material:
                "-",

              size:
                "-",

              price:
                `₹${product.price.toLocaleString()}`,

              stock:
                product.stock,

              sold:
                analytics.sold,

              revenue:
                `₹${analytics.revenue.toLocaleString()}`,

              remaining:
                product.stock,

              status,

            });

          }

        }
      );

      /*
        ==========================================
        HEADER STYLING
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

        "attachment; filename=products-analytics-report.xlsx"
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
