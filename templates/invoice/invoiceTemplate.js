import { INVOICE_CONFIG } from "./invoiceConfig.js";

import { invoiceStyles } from "./invoiceStyles.js";

import {
  formatCurrency,
  formatDate,
  formatAddress,
  safe,
  paymentStatusBadge,
  orderStatusBadge,
  calculateSavings,
  companyAddress,
} from "./invoiceUtils.js";

export function getInvoiceTemplate({

  order,

  invoiceNumber,

  invoiceDate,

}) {

const itemsHtml = order.items
  .map(
    (item) => `
<tr>

<td>

<strong>

${safe(item.name)}

</strong>

</td>

<td>

${safe(item.variant?.material)}

</td>

<td>

${safe(item.variant?.size)}

</td>

<td>

${item.quantity}

</td>

<td>

${formatCurrency(item.price)}

</td>

<td>

<strong>

${formatCurrency(
  item.price * item.quantity
)}

</strong>

</td>

</tr>
`
  )
  .join("");

return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
/>

<title>

Invoice ${invoiceNumber}

</title>

<style>

${invoiceStyles}

</style>

</head>

<body>

<!-- ========================= -->

<!-- HEADER -->

<!-- ========================= -->

<div class="header">

<div class="brand">

<div class="logo">

${INVOICE_CONFIG.logo}

</div>

<div class="tagline">

${INVOICE_CONFIG.tagline}

</div>

</div>

<div class="invoice-meta">

<div class="invoice-title">

TAX INVOICE

</div>

<div class="meta-row">

<strong>

Invoice No:

</strong>

${invoiceNumber}

</div>

<div class="meta-row">

<strong>

Invoice Date:

</strong>

${formatDate(invoiceDate)}

</div>

<div class="meta-row">

<strong>

Order Number:

</strong>

${order.orderNumber}

</div>

<div class="meta-row">

<strong>

Order Status:

</strong>

${orderStatusBadge(
  order.orderStatus
)}

</div>

<div class="meta-row">

<strong>

Payment:

</strong>

${paymentStatusBadge(
  order.paymentStatus
)}

</div>

</div>

</div>

<!-- ========================= -->

<!-- COMPANY + CUSTOMER -->

<!-- ========================= -->

<div class="grid">

<div class="card">

<div class="section-title">

Sold By

</div>

<div class="address">

<strong>

${INVOICE_CONFIG.companyName}

</strong>

<br><br>

${companyAddress()}

<br><br>

GSTIN:

${INVOICE_CONFIG.gstin}

<br>

Email:

${INVOICE_CONFIG.email}

<br>

Phone:

${INVOICE_CONFIG.phone}

<br>

Website:

${INVOICE_CONFIG.website}

</div>

</div>

<div class="card">

<div class="section-title">

Bill To

</div>

<div class="address">

<strong>

${safe(
  order.customerName
)}

</strong>

<br><br>

${safe(
  order.customerEmail
)}

<br>

${safe(
  order.customerPhone
)}

<br><br>

${formatAddress(
  order.shippingAddress
)}

</div>

</div>

</div>

<!-- ========================= -->

<!-- ORDER ITEMS -->

<!-- ========================= -->

<div class="section">

<div class="section-title">

Items Purchased

</div>

<table>

<thead>

<tr>

<th>

Product

</th>

<th>

Material

</th>

<th>

Size

</th>

<th>

Qty

</th>

<th>

Unit Price

</th>

<th>

Total

</th>

</tr>

</thead>

<tbody>

${itemsHtml}

</tbody>

</table>

</div>

<!-- ========================= -->

<!-- TOTALS -->

<!-- ========================= -->

<table class="totals">

<tr>

<td class="total-label">

Subtotal

</td>

<td align="right">

${formatCurrency(
  order.subtotalPrice
)}

</td>

</tr>

<tr>

<td class="total-label">

Discount

</td>

<td align="right">

- ${formatCurrency(
  calculateSavings(order)
)}

</td>

</tr>

<tr>

<td class="total-label">

Shipping

</td>

<td align="right">

${formatCurrency(
  order.shippingPrice
)}

</td>

</tr>

<tr>

<td class="total-label">

Tax

</td>

<td align="right">

${formatCurrency(
  order.taxPrice
)}

</td>

</tr>

<tr class="grand">

<td>

Grand Total

</td>

<td align="right">

${formatCurrency(
  order.totalPrice
)}

</td>

</tr>

</table>

<!-- ========================= -->

<!-- PAYMENT INFORMATION -->

<!-- ========================= -->

<div class="section">

<div class="section-title">

Payment Information

</div>

<div class="grid">

<div class="card">

<p>

<strong>

Payment Method

</strong>

</p>

<p>

${safe(
  order.paymentMethod
)}

</p>

</div>

<div class="card">

<p>

<strong>

Payment Status

</strong>

</p>

<p>

${paymentStatusBadge(
  order.paymentStatus
)}

</p>

</div>

</div>

</div>

<!-- ========================= -->

<!-- ORDER SUMMARY -->

<!-- ========================= -->

<div class="section">

<div class="section-title">

Order Summary

</div>

<div class="grid">

<div class="card">

<p>

<strong>

Order Number

</strong>

</p>

<p>

${order.orderNumber}

</p>

</div>

<div class="card">

<p>

<strong>

Order Status

</strong>

</p>

<p>

${orderStatusBadge(
  order.orderStatus
)}

</p>

</div>

</div>

</div>

<!-- ========================= -->

<!-- COUPON -->

<!-- ========================= -->

${
order.coupon

? `

<div class="section">

<div class="section-title">

Coupon Applied

</div>

<div class="card">

<p>

<strong>

Coupon Code

</strong>

</p>

<p>

${safe(
order.coupon.code
)}

</p>

<br>

<p>

<strong>

Savings

</strong>

</p>

<p>

${formatCurrency(
calculateSavings(order)
)}

</p>

</div>

</div>

`

: ""

}

<!-- ========================= -->

<!-- WARRANTY -->

<!-- ========================= -->

<div class="notice">

<h3 style="

margin-bottom:12px;

color:${INVOICE_CONFIG.primary};

">

Warranty Information

</h3>

<p>

Your Gemora jewellery is covered under our
manufacturing warranty.

</p>

<br>

<ul style="

padding-left:18px;

line-height:1.9;

">

<li>

Manufacturing defects are covered.

</li>

<li>

Stone setting defects are covered.

</li>

<li>

Please retain this invoice for future warranty claims.

</li>

<li>

Physical damage, accidental damage and normal wear & tear are not covered.

</li>

</ul>

</div>

<!-- ========================= -->

<!-- IMPORTANT INFORMATION -->

<!-- ========================= -->

<div class="section">

<div class="section-title">

Important Information

</div>

<div class="card">

<ul style="
padding-left:18px;
line-height:1.9;
">

<li>

Please retain this invoice for warranty and future reference.

</li>

<li>

Returns or exchanges, if applicable, are subject to Gemora's return policy.

</li>

<li>

Products showing signs of misuse, accidental damage, alterations, or normal wear & tear are not eligible for warranty claims.

</li>

<li>

For any assistance, please contact our support team using the details below.

</li>

</ul>

</div>

</div>

<!-- ========================= -->

<!-- CUSTOMER SUPPORT -->

<!-- ========================= -->

<div class="support">

<div class="section-title">

Need Help?

</div>

<div class="grid">

<div>

<p>

<strong>Email</strong>

</p>

<p>

${INVOICE_CONFIG.email}

</p>

</div>

<div>

<p>

<strong>Phone</strong>

</p>

<p>

${INVOICE_CONFIG.phone}

</p>

</div>

</div>

<br>

<p>

<strong>Website</strong>

</p>

<p>

${INVOICE_CONFIG.website}

</p>

<br>

<p>

<strong>Business Hours</strong>

</p>

<p>

${INVOICE_CONFIG.businessHours}

</p>

</div>

<!-- ========================= -->

<!-- THANK YOU -->

<!-- ========================= -->

<div class="notice">

<h3 style="
margin-bottom:12px;
color:${INVOICE_CONFIG.primary};
">

Thank You

</h3>

<p>

Thank you for choosing
<strong>${INVOICE_CONFIG.brand}</strong>.

</p>

<p style="margin-top:10px;">

We truly appreciate your trust in us and hope your jewellery becomes a cherished part of your collection.

</p>

</div>

<!-- ========================= -->

<!-- SIGNATURE -->

<!-- ========================= -->

<div
style="
margin-top:70px;
display:flex;
justify-content:flex-end;
"
>

<div
style="
width:240px;
text-align:center;
"
>

<div
style="
height:60px;
"
>

</div>

<div
style="
border-top:1px solid #999;
padding-top:8px;
font-weight:bold;
"
>

Authorized Signatory

</div>

<div
style="
font-size:12px;
color:#777;
margin-top:4px;
"
>

${INVOICE_CONFIG.companyName}

</div>

</div>

</div>

<!-- ========================= -->

<!-- FOOTER -->

<!-- ========================= -->

<div class="footer">

<p>

${INVOICE_CONFIG.footerNote}

</p>

<br>

<p>

${INVOICE_CONFIG.copyright}

</p>

</div>

</body>

</html>

`;

}
