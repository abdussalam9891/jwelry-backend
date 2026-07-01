import { emailLayout } from "./layout/emailLayout.js";
import { infoCard } from "./layout/components.js";

export function getOrderCancelledTemplate({
  customerName,
  orderNumber,
}) {
  return emailLayout({
    title: "Order Cancelled",

    preheader:
      "Your Gemora order has been cancelled.",

    content: `

<h2 style="
margin-top:0;
color:#6B1A2A;
">
Your Order Has Been Cancelled
</h2>

<p>

Hi <strong>${customerName}</strong>,

</p>

<p>

We're writing to let you know that your order has been cancelled.

If this cancellation was requested by you, no further action is required.

</p>

${infoCard([
  {
    label: "Order Number",
    value: orderNumber,
  },
  {
    label: "Order Status",
    value: "Cancelled",
  },
])}

<div class="notice">

<h3 style="
margin-top:0;
color:#6B1A2A;
">

Refund Information

</h3>

<p>

If your payment was successfully completed before the cancellation, any eligible refund will be processed using your original payment method.

</p>

<p style="
margin-top:12px;
">

Depending on your bank or payment provider, the refund may take
<strong>5–7 business days</strong> to appear in your account.

</p>

</div>

<p>

If you did not request this cancellation or believe it was made in error, please contact our support team. We'll be happy to assist you.

</p>

<p>

Thank you for choosing <strong>Gemora</strong>. We hope to serve you again in the future.

</p>

`,
  });
}
