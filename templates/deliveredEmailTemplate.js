import { emailLayout } from "./layout/emailLayout.js";
import { infoCard } from "./layout/components.js";

export function getDeliveredEmailTemplate({
  customerName,
  orderNumber,
  invoiceNumber,
}) {
  return emailLayout({
    title: "Order Delivered",

    preheader:
      "Your Gemora order has been delivered successfully.",

    content: `

<h2 style="
color:#6B1A2A;
margin-top:0;
margin-bottom:18px;
">
Your Order Has Been Delivered ✨
</h2>

<p>

Hi <strong>${customerName}</strong>,

</p>

<p>

We're delighted to let you know that your Gemora order has been delivered successfully.

We hope your new jewellery becomes a cherished part of your collection and brings you joy for years to come.

</p>

${infoCard([
  {
    label: "Order Number",
    value: orderNumber,
  },
  {
    label: "Invoice Number",
    value: invoiceNumber,
  },
])}

<div class="notice">

<h3 style="
margin-top:0;
color:#6B1A2A;
">
Your Attachments
</h3>

<p>

We've attached the following documents for your convenience:

</p>

<ul style="
margin:12px 0 0;
padding-left:20px;
line-height:1.9;
">

<li>Tax Invoice (PDF)</li>

<li>Gemora Jewellery Care Guide (PDF)</li>

</ul>

</div>

 

<p>

Thank you for placing your trust in Gemora.

We're honored to be a part of your special moments and hope to serve you again soon.

</p>

`,
  });
}
