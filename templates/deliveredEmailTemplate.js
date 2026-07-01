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

<li>📄 Tax Invoice (PDF)</li>

<li>💎 Gemora Jewellery Care Guide (PDF)</li>

</ul>

</div>

<div class="card">

<h3 style="
margin-top:0;
color:#6B1A2A;
">
Manufacturing Warranty
</h3>

<p>

Your Gemora jewellery is protected under our manufacturing warranty.

</p>

<table
width="100%"
style="margin-top:18px;"
>

<tr>

<td
width="50%"
style="
vertical-align:top;
padding-right:20px;
"
>

<strong
style="color:#2E7D32;"
>

✓ Covered

</strong>

<ul style="
padding-left:18px;
line-height:1.8;
">

<li>Manufacturing defects</li>

<li>Craftsmanship issues</li>

<li>Stone setting defects</li>

</ul>

</td>

<td
style="
vertical-align:top;
"
>

<strong
style="color:#B71C1C;"
>

✗ Not Covered

</strong>

<ul style="
padding-left:18px;
line-height:1.8;
">

<li>Accidental damage</li>

<li>Physical damage</li>

<li>Improper handling</li>

<li>Normal wear & tear</li>

<li>Unauthorized repairs</li>

</ul>

</td>

</tr>

</table>

<p style="
margin-top:18px;
margin-bottom:0;
">

Please retain your invoice, as it may be required when making a warranty claim.

</p>

</div>

<p>

Thank you for placing your trust in Gemora.

We're honored to be a part of your special moments and hope to serve you again soon.

</p>

`,
  });
}
