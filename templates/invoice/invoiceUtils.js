import { INVOICE_CONFIG } from "./invoiceConfig.js";

/*
|--------------------------------------------------------------------------
| Currency
|--------------------------------------------------------------------------
*/

export function formatCurrency(value = 0) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/*
|--------------------------------------------------------------------------
| Safe Value
|--------------------------------------------------------------------------
*/

export function safe(value, fallback = "-") {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  return value;
}

/*
|--------------------------------------------------------------------------
| Address
|--------------------------------------------------------------------------
*/

export function formatAddress(address = {}) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join("<br>");
}

/*
|--------------------------------------------------------------------------
| Payment Status Badge
|--------------------------------------------------------------------------
*/

export function paymentStatusBadge(status = "") {
  switch (status.toUpperCase()) {
    case "PAID":
      return `
        <span class="badge success">
          Paid
        </span>
      `;

    case "PENDING":
      return `
        <span class="badge danger">
          Pending
        </span>
      `;

    case "FAILED":
      return `
        <span class="badge danger">
          Failed
        </span>
      `;

    case "REFUNDED":
      return `
        <span class="badge">
          Refunded
        </span>
      `;

    default:
      return safe(status);
  }
}

/*
|--------------------------------------------------------------------------
| Order Status Badge
|--------------------------------------------------------------------------
*/

export function orderStatusBadge(status = "") {
  switch (status.toUpperCase()) {
    case "PLACED":
      return `
        <span class="badge">
          Placed
        </span>
      `;

    case "CONFIRMED":
      return `
        <span class="badge success">
          Confirmed
        </span>
      `;

    case "SHIPPED":
      return `
        <span class="badge success">
          Shipped
        </span>
      `;

    case "DELIVERED":
      return `
        <span class="badge success">
          Delivered
        </span>
      `;

    case "CANCELLED":
      return `
        <span class="badge danger">
          Cancelled
        </span>
      `;

    default:
      return safe(status);
  }
}

/*
|--------------------------------------------------------------------------
| Totals
|--------------------------------------------------------------------------
*/

export function calculateSavings(order) {
  return Number(order?.coupon?.discountAmount || 0);
}

/*
|--------------------------------------------------------------------------
| Company Address
|--------------------------------------------------------------------------
*/

export function companyAddress() {
  return INVOICE_CONFIG.address.join("<br>");
}
