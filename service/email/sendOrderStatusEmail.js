import { sendEmail } from "./sendEmail.js";

import { getOrderPlacedTemplate } from "../../templates/orderPlacedTemplate.js";
import { getOrderConfirmedTemplate } from "../../templates/orderConfirmedTemplate.js";
import { getOrderShippedTemplate } from "../../templates/orderShippedTemplate.js";
import { getOrderCancelledTemplate } from "../../templates/orderCancelledTemplate.js";

const statusConfig = {
  PLACED: {
  subject: "Order Received",
  template: getOrderPlacedTemplate,
},

CONFIRMED: {
  subject: "Order Confirmed",
  template: getOrderConfirmedTemplate,
},

  SHIPPED: {
    subject: "Your Order Has Been Shipped",
    template: getOrderShippedTemplate,
  },

  CANCELLED: {
    subject: "Order Cancelled",
    template: getOrderCancelledTemplate,
  },
};

export async function sendOrderStatusEmail({
  email,
  customerName,
  orderNumber,
  status,
}) {

  console.log("========== STATUS EMAIL ==========");
  console.log("Status:", status);

  const config = statusConfig[status];

  console.log("Config:", config);

  if (!config) {
    console.log("No config found");
    return;
  }

  const html = config.template({
    customerName,
    orderNumber,
  });

  console.log("Template generated");

  const response = await sendEmail({
    to: email,
    subject: `${config.subject} • ${orderNumber}`,
    html,
  });

  console.log("Resend Response:", response);

  return response;
}
