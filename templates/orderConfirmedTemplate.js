import { emailLayout } from "./layout/emailLayout.js";

import { infoCard } from "./layout/components.js";

export function getOrderConfirmedTemplate({
  customerName,
  orderNumber,
}) {
  return emailLayout({
    title: "Order Confirmed",

    preheader:
      "Your Gemora order has been confirmed and is being prepared.",

    content: `

<h2 style="
margin-top:0;
color:#6B1A2A;
">
Your Order Has Been Confirmed 💎
</h2>

<p>

Hi <strong>${customerName}</strong>,

</p>

<p>

Great news! Your order has now been
<strong>confirmed</strong> by our team.

We're carefully preparing your jewellery for packaging and shipment.

</p>

${infoCard([
  {
    label: "Order Number",
    value: orderNumber,
  },
  {
    label: "Order Status",
    value: "Confirmed",
  },
])}

<div class="notice">

<h3 style="
margin-top:0;
color:#6B1A2A;
">

What Happens Next?

</h3>

<ul style="
padding-left:20px;
line-height:1.9;
margin-top:12px;
">

<li>

Our quality team performs a final inspection.

</li>

<li>

Your jewellery is securely packaged.

</li>

<li>

Your shipment is handed over to our delivery partner.

</li>

<li>

You'll receive another email with tracking details once your order has been shipped.

</li>

</ul>

</div>

<p>

Thank you for choosing
<strong>Gemora</strong>.

We're excited to deliver something truly special to you.

</p>

`,
  });
}
