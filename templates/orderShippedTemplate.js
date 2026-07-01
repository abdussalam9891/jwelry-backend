import { emailLayout } from "./layout/emailLayout.js";
import { infoCard } from "./layout/components.js";

export function getOrderShippedTemplate({
  customerName,
  orderNumber,
}) {
  return emailLayout({
    title: "Order Shipped",

    preheader:
      "Your Gemora order has been shipped and is on its way.",

    content: `

<h2 style="
margin-top:0;
color:#6B1A2A;
">
Your Order Is On The Way 🚚
</h2>

<p>

Hi <strong>${customerName}</strong>,

</p>

<p>

Great news! Your order has been carefully packed and handed over to our delivery partner.

It's now on its way to you.

</p>

${infoCard([
  {
    label: "Order Number",
    value: orderNumber,
  },
  {
    label: "Order Status",
    value: "Shipped",
  },
])}

<div class="notice">

<h3 style="
margin-top:0;
color:#6B1A2A;
">

What's Next?

</h3>

<ul style="
padding-left:20px;
line-height:1.9;
margin-top:12px;
">

<li>

Your package is currently in transit.

</li>

<li>

Please ensure someone is available to receive the package.

</li>

<li>

You'll receive your jewellery soon.

</li>

</ul>

</div>

<p>

Thank you for choosing
<strong>Gemora</strong>.

We're excited for your jewellery to reach you safely.

</p>

`,
  });
}
