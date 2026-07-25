import mongoose from "mongoose";
import Product from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find();

for (const product of products) {
  // category migration

  if (product.category === "neckwear") {
    product.category = "neckwears";
    product.productType = "necklace";
  }

  // ringsss

  if (
    product.category === "rings" &&
    !product.productType
  ) {
    if (
      product.subcategory?.includes(
        "engagement"
      )
    ) {
      product.productType =
        "engagement-ring";
    } else if (
      product.subcategory?.includes(
        "wedding"
      )
    ) {
      product.productType =
        "wedding-ring";
    } else {
      product.productType =
        "statement-ring";
    }
  }

  // earrings

  if (
    product.category === "earrings" &&
    !product.productType
  ) {
    product.productType = "stud";
  }

  // bracelets

  if (
    product.category === "bracelets" &&
    !product.productType
  ) {
    product.productType = "bracelet";
  }

  await product.save();
}

console.log("Migration complete");

await mongoose.disconnect();
