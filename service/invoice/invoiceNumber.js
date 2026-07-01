import Order from "../../models/orderModel.js";

export async function generateInvoiceNumber() {
  const year = new Date().getFullYear();

  const count = await Order.countDocuments({
    "invoice.generatedAt": {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    },
  });

  const sequence = String(count + 1).padStart(6, "0");

  return `INV-${year}-${sequence}`;
}
