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

<div class="invoice-title">TAX INVOICE</div>
<div style="font-size:11px;color:#666;margin-top:2px;">
Original for Recipient
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

Email:

${INVOICE_CONFIG.email}

<br>

GSTIN:

${INVOICE_CONFIG.gstin}





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
        border-top:1px solid #999;
        padding-top:8px;
        font-weight:bold;
      "
    >
      Authorized Signatory
    </div>
  </div>
</div>







 <!-- ========================= -->
<!-- WARRANTY & RETURNS -->
<!-- ========================= -->

<div>
  <strong>Warranty & Returns:</strong>
  For warranty information, please visit
  <a
    href="http://localhost:5500/pages/warranty.html"
    style="color:${INVOICE_CONFIG.primary}; text-decoration:none; font-weight:600;"
  >
    Warranty Policy
  </a>.
  For return and refund details, please visit
  <a
    href="http://localhost:5500/pages/returns.html"
    style="color:${INVOICE_CONFIG.primary}; text-decoration:none; font-weight:600;"
  >
    Return Policy
  </a>.
</divss=>













<!-- ========================= -->
<!-- CUSTOMER SUPPORT -->
<!-- ========================= -->

<div>
  <strong>Need Help?</strong>
  Contact us at
  <a
    href="mailto:${INVOICE_CONFIG.email}"
    style="color:${INVOICE_CONFIG.primary}; text-decoration:none; font-weight:600;"
  >
    ${INVOICE_CONFIG.email}
  </a>
  or visit
  <a
    href="${INVOICE_CONFIG.website}"
    style="color:${INVOICE_CONFIG.primary}; text-decoration:none; font-weight:600;"
  >
    ${INVOICE_CONFIG.website}
  </a>
  for support and assistance.
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















