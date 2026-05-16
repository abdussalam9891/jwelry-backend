import ExcelJS from "exceljs";

import Order from "../../models/orderModel.js";



export const exportCustomersReport =
  async (req, res) => {

    try {

      /*
      ==========================================
      CUSTOMER ANALYTICS
      ==========================================
      */

      const customers =
        await Order.aggregate([

          {
            $group: {

              _id: "$user",



              customerName: {
                $first:
                  "$customerName",
              },



              customerEmail: {
                $first:
                  "$customerEmail",
              },



              customerPhone: {
                $first:
                  "$customerPhone",
              },



              totalOrders: {
                $sum: 1,
              },



              totalSpent: {
                $sum:
                  "$totalPrice",
              },



              averageOrderValue: {
                $avg:
                  "$totalPrice",
              },



              lastOrderDate: {
                $max:
                  "$createdAt",
              },



              joinedAt: {
                $min:
                  "$createdAt",
              },



              latestState: {
                $last:
                  "$shippingAddress.state",
              },



              latestCity: {
                $last:
                  "$shippingAddress.city",
              },



              preferredPayment: {
                $last:
                  "$paymentMethod",
              },

            },

          },



          {
            $sort: {
              totalSpent: -1,
            },
          },

        ]);



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
          "Customers Report"
        );



      /*
      ==========================================
      COLUMNS
      ==========================================
      */

      sheet.columns = [

        {
          header: "Customer Name",
          key: "name",
          width: 28,
        },

        {
          header: "Email",
          key: "email",
          width: 36,
        },

        {
          header: "Phone",
          key: "phone",
          width: 20,
        },

        {
          header: "Customer Tier",
          key: "tier",
          width: 18,
        },

        {
          header: "Total Orders",
          key: "orders",
          width: 18,
        },

        {
          header: "Total Revenue",
          key: "revenue",
          width: 20,
        },

        {
          header: "Average Order Value",
          key: "aov",
          width: 24,
        },

        {
          header: "First Purchase",
          key: "joined",
          width: 18,
        },

        {
          header: "Last Purchase",
          key: "lastOrder",
          width: 18,
        },

        {
          header: "Preferred Payment",
          key: "payment",
          width: 22,
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

      ];



      /*
      ==========================================
      ROWS
      ==========================================
      */

      customers.forEach(
        (customer) => {

          let tier =
            "Bronze";



          if (
            customer.totalSpent >=
            300000
          ) {

            tier =
              "Platinum";

          }

          else if (

            customer.totalSpent >=
            100000

          ) {

            tier =
              "Gold";

          }

          else if (

            customer.totalSpent >=
            30000

          ) {

            tier =
              "Silver";

          }



          sheet.addRow({

            name:
              customer.customerName || "-",

            email:
              customer.customerEmail || "-",

            phone:
              customer.customerPhone || "-",

            tier,

            orders:
              customer.totalOrders || 0,

            revenue:
              `₹${(
                customer.totalSpent || 0
              ).toLocaleString()}`,

            aov:
              `₹${Math.floor(
                customer.averageOrderValue || 0
              ).toLocaleString()}`,

            joined:
              customer.joinedAt

                ? new Date(
                    customer.joinedAt
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

            lastOrder:
              customer.lastOrderDate

                ? new Date(
                    customer.lastOrderDate
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

            payment:
              customer.preferredPayment || "-",

            city:
              customer.latestCity || "-",

            state:
              customer.latestState || "-",

          });

        }
      );



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

        "attachment; filename=customers-report.xlsx"
      );



      await workbook.xlsx.write(res);

      return res.end();

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };
