import fs from "fs/promises";
import os from "os";
import path from "path";

import puppeteer from "puppeteer";

import { generateInvoiceNumber } from "./invoiceNumber.js";
import { getInvoiceTemplate } from "../../templates/invoice/invoiceTemplate.js";
import { uploadPdfToCloudinary } from "../../utils/cloudinaryUploadPdf.js";

export async function generateInvoice(order) {
  if (!order) {
    throw new Error("Order is required");
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate invoice generation
  |--------------------------------------------------------------------------
  */

  if (order.invoice?.generatedAt) {
    return order.invoice;
  }

  /*
  |--------------------------------------------------------------------------
  | Invoice Details
  |--------------------------------------------------------------------------
  */

  const invoiceNumber =
    await generateInvoiceNumber();

  // Pass raw date.
  // invoiceTemplate.js formats it.
  const invoiceDate = new Date();

  const html =
    getInvoiceTemplate({
      order,
      invoiceNumber,
      invoiceDate,
    });

  let browser;

  let pdfPath;

  try {
    /*
    |--------------------------------------------------------------------------
    | Launch Browser
    |--------------------------------------------------------------------------
    */

    browser =
      await puppeteer.launch({
        headless: true,

        // Uncomment on Linux / VPS

        // args: [
        //   "--no-sandbox",
        //   "--disable-setuid-sandbox",
        // ],
      });

    const page =
      await browser.newPage();

    /*
    |--------------------------------------------------------------------------
    | Render HTML
    |--------------------------------------------------------------------------
    */

    await page.setContent(html, {
      waitUntil:
        "domcontentloaded",
    });

    /*
    |--------------------------------------------------------------------------
    | Generate PDF
    |--------------------------------------------------------------------------
    */

    pdfPath = path.join(
      os.tmpdir(),
      `${invoiceNumber}.pdf`
    );

    await page.pdf({
      path: pdfPath,

      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      displayHeaderFooter: false,

      margin: {
        top: "18mm",
        right: "18mm",
        bottom: "18mm",
        left: "18mm",
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Upload PDF
    |--------------------------------------------------------------------------
    */

    const uploaded =
      await uploadPdfToCloudinary(
        pdfPath,
        invoiceNumber
      );

    console.log(
      "Cloudinary Upload Response:"
    );

    console.log(uploaded);

    /*
    |--------------------------------------------------------------------------
    | Save Invoice
    |--------------------------------------------------------------------------
    */

    order.invoice = {
      invoiceNumber,

      url: uploaded.secure_url,

      cloudinaryPublicId:
        uploaded.public_id,

      generatedAt:
        new Date(),
    };

    await order.save();

    return order.invoice;
  } finally {
    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    if (browser) {
      await browser.close();
    }

    if (pdfPath) {
      try {
        await fs.unlink(pdfPath);
      } catch (err) {
        console.warn(
          "Failed to delete temporary invoice:",
          err.message
        );
      }
    }
  }
}
