import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const statusConfig = {
  PLACED: {
    subject: "Order Confirmed",
    heading: "Order Confirmed",
    message:
      "We've received your order and started processing it.",
  },

  SHIPPED: {
    subject: "Order Shipped",
    heading: "Your Order Is On The Way",
    message:
      "Great news! Your order has been shipped.",
  },

  DELIVERED: {
    subject: "Order Delivered",
    heading: "Order Delivered",
    message:
      "Your order has been successfully delivered.",
  },

  CANCELLED: {
    subject: "Order Cancelled",
    heading: "Order Cancelled",
    message:
      "Your order has been cancelled.",
  },
};

export const sendOrderStatusEmail =
  async ({
    email,
    customerName,
    orderNumber,
    status,
  }) => {




    if (!email) {

      console.log(
        "No email provided"
      );

      return;
    }

    const config =
      statusConfig[status];

    if (!config) {

      console.log(
        "Invalid status:",
        status
      );

      return;
    }

    try {

      const response =
        await resend.emails.send({

          from:
            "Gemora <onboarding@resend.dev>",

          to: email,

          subject:
            `${config.subject} • ${orderNumber}`,

          html: `
            <div style="
              font-family:Arial,sans-serif;
              max-width:600px;
              margin:auto;
              padding:40px;
            ">

              <h1 style="
                color:#6B1A2A;
              ">
                ${config.heading}
              </h1>

              <p>
                Hi ${customerName},
              </p>

              <p>
                ${config.message}
              </p>

              <div style="
                background:#f7f7f7;
                padding:16px;
                border-radius:12px;
                margin:20px 0;
              ">
                <strong>
                  Order Number:
                </strong>
                ${orderNumber}
              </div>

              <p>
                Thank you for choosing Gemora.
              </p>

            </div>
          `,
        });

      

      return response;

    } catch (err) {

      console.error(
        "Order status email failed:"
      );

      console.error(err);

      throw err;
    }

  };
