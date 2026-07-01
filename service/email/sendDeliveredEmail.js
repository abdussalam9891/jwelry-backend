import fs from "fs/promises";
import path from "path";

import { sendEmail } from "./sendEmail.js";

import { getDeliveredEmailTemplate } from "../../templates/deliveredEmailTemplate.js";

export async function sendDeliveredEmail({
  order,
}) {
  if (!order?.customerEmail) {
    console.log("No customer email provided.");
    return;
  }

  if (!order.invoice?.url) {
    throw new Error(
      "Invoice has not been generated."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Download Invoice PDF
  |--------------------------------------------------------------------------
  */

  const response = await fetch(
    order.invoice.url
  );

  if (!response.ok) {
    throw new Error(
      "Failed to download invoice PDF."
    );
  }

  const invoiceBuffer = Buffer.from(
    await response.arrayBuffer()
  );

  /*
  |--------------------------------------------------------------------------
  | Read Care Guide
  |--------------------------------------------------------------------------
  */

  const careGuidePath = path.join(
    process.cwd(),
    "public",
    "documents",
    "care-guide.pdf"
  );

  const careGuideBuffer =
    await fs.readFile(careGuidePath);

  /*
  |--------------------------------------------------------------------------
  | Generate Email HTML
  |--------------------------------------------------------------------------
  */

  const html =
    getDeliveredEmailTemplate({
      customerName:
        order.customerName,

      orderNumber:
        order.orderNumber,

      invoiceNumber:
        order.invoice.invoiceNumber,
    });

  /*
  |--------------------------------------------------------------------------
  | Send Email
  |--------------------------------------------------------------------------
  */

  return sendEmail({
    to: order.customerEmail,

    subject: `Your Gemora Order Has Been Delivered • ${order.orderNumber}`,

    html,

    attachments: [
      {
        filename: `${order.invoice.invoiceNumber}.pdf`,

        content:
          invoiceBuffer.toString(
            "base64"
          ),
      },

      {
        filename:
          "Gemora-Jewelry-Care-Guide.pdf",

        content:
          careGuideBuffer.toString(
            "base64"
          ),
      },
    ],
  });
}
