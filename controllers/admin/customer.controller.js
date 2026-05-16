
import Order from "../../models/orderModel.js";




export const getCustomers =
  async (req, res) => {

    try {

      const {
        search = "",
        tier = "All",
        sort = "Newest",
        page = 1,
        limit = 8,
      } = req.query;



      /* AGGREGATION */

      let customers =
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

            },

          },

        ]);



      /* FORMAT */

      customers =
        customers.map(
          (customer) => {

            let customerTier =
              "Bronze";



            if (
              customer.totalSpent >=
              300000
            ) {

              customerTier =
                "Platinum";

            }

            else if (

              customer.totalSpent >=
              100000

            ) {

              customerTier =
                "Gold";

            }

            else if (

              customer.totalSpent >=
              30000

            ) {

              customerTier =
                "Silver";

            }



            return {

              ...customer,

              customerTier,

            };

          }
        );



      /* SEARCH */

      if (search) {

        customers =
          customers.filter(
            (customer) =>

              customer.customerName
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )

              ||

              customer.customerEmail
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )

              ||

              customer.customerPhone
                ?.includes(search)
          );

      }



      /* TIER FILTER */

      if (
        tier !== "All"
      ) {

        customers =
          customers.filter(
            (customer) =>

              customer.customerTier ===
              tier
          );

      }



      /* SORT */

      if (
        sort ===
        "Highest Spend"
      ) {

        customers.sort(
          (a, b) =>

            b.totalSpent -
            a.totalSpent
        );

      }

      else if (

        sort ===
        "Most Orders"

      ) {

        customers.sort(
          (a, b) =>

            b.totalOrders -
            a.totalOrders
        );

      }

      else {

        customers.sort(
          (a, b) =>

            new Date(
              b.joinedAt
            ) -

            new Date(
              a.joinedAt
            )
        );

      }



      /* PAGINATION */

      const total =
        customers.length;



      const startIndex =
        (page - 1) *
        Number(limit);



      const paginatedCustomers =
        customers.slice(
          startIndex,
          startIndex +
          Number(limit)
        );



      /* RESPONSE */

      res.json({

        success: true,

        customers:
          paginatedCustomers,



        pagination: {

          total,



          page:
            Number(page),



          pages:
            Math.ceil(
              total /
              Number(limit)
            ),

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



  export const getCustomerDetails =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      /* GET ORDERS */

      const orders =
        await Order.find({
          user: id,
        })

        .sort({
          createdAt: -1,
        });



      if (!orders.length) {

        return res.status(404).json({
          message:
            "Customer not found",
        });

      }



      /* CUSTOMER INFO */

      const customer = {

        _id: id,

        customerName:
          orders[0].customerName,

        customerEmail:
          orders[0].customerEmail,

        customerPhone:
          orders[0].customerPhone,



        totalOrders:
          orders.length,



        totalSpent:
          orders.reduce(
            (acc, order) =>
              acc +
              order.totalPrice,
            0
          ),



        lastOrderDate:
          orders[0].createdAt,



        joinedAt:
          orders[
            orders.length - 1
          ].createdAt,



        customerTier:

          orders.reduce(
            (acc, order) =>
              acc +
              order.totalPrice,
            0
          ) >= 300000

            ? "Platinum"

            : orders.reduce(
                (acc, order) =>
                  acc +
                  order.totalPrice,
                0
              ) >= 100000

            ? "Gold"

            : orders.reduce(
                (acc, order) =>
                  acc +
                  order.totalPrice,
                0
              ) >= 30000

            ? "Silver"

            : "Bronze",



        latestAddress: `

          ${orders[0]
            .shippingAddress
            ?.addressLine1},

          ${orders[0]
            .shippingAddress
            ?.city},

          ${orders[0]
            .shippingAddress
            ?.state}

          -

          ${orders[0]
            .shippingAddress
            ?.pincode}

        `,



        orders,

      };



      res.json({

        success: true,

        customer,

      });

    } catch (error) {

      console.error(error);



      res.status(500).json({

        message:
          error.message,

      });

    }

  };
