import mongoose from "mongoose";

import dotenv from "dotenv";

import path from "path";

import fs from "fs";

import Product from "./models/productModel.js";

import cloudinary from "./config/cloudinary.js";

dotenv.config();



// ==============================
// CONNECT DB
// ==============================

await mongoose.connect(
  process.env.MONGO_URI
);

console.log("✅ MongoDB Connected");



// ==============================
// CATEGORY COUNTERS
// ==============================

const categoryCounters = {

  rings: 1,

  bracelets: 1,

  earrings: 1,

  necklaces: 1,

};



// ==============================
// MIGRATION
// ==============================

const migrateImages = async () => {

  try {

    const products =
      await Product.find()
        .sort({ createdAt: 1 });



    console.log(
      `📦 Found ${products.length} products`
    );



    for (const product of products) {

      console.log(
        `\n====================================`
      );

      console.log(
        `📦 Processing: ${product.name}`
      );



      // SKIP IF ALREADY MIGRATED

      if (

        product.images?.length > 0 &&

        typeof product.images[0] ===
          "object" &&

        product.images[0]?.public_id

      ) {

        console.log(
          "⏭ Already migrated"
        );

        continue;

      }



      const category =
        product.category;



     const imageIndex =
  ((categoryCounters[category] - 1) % 5) + 1;



      // YOUR FILES ARE INSIDE GOLD FOLDER

      const imagePaths = [

        `uploads/products/${category}/gold/${imageIndex}.webp`,

        `uploads/products/${category}/gold/${imageIndex}-2.webp`,

      ];



      console.log(
        "🖼 Image Paths:",
        imagePaths
      );



      const uploadedImages = [];



      // ==============================
      // UPLOAD BOTH IMAGES
      // ==============================

      for (const imagePath of imagePaths) {

        try {

          const localFilePath =
            path.resolve(
              imagePath
            );



          console.log(
            `📁 Checking: ${localFilePath}`
          );



          const exists =
            fs.existsSync(
              localFilePath
            );



          console.log(
            `📌 Exists: ${exists}`
          );



          if (!exists) {

            console.log(
              `❌ Missing file`
            );

            continue;

          }



          console.log(
            `⬆ Uploading...`
          );



          const result =
            await cloudinary.uploader.upload(
              localFilePath,
              {

                folder:
                  `products/${category}`,

              }
            );



          console.log(
            `✅ Uploaded: ${result.public_id}`
          );



          uploadedImages.push({

            url:
              result.secure_url,

            public_id:
              result.public_id,

          });

        } catch (error) {

          console.log(
            `❌ Upload failed`
          );

          console.error(error);

        }

      }



      // ==============================
      // SAVE
      // ==============================

      if (
        uploadedImages.length === 0
      ) {

        console.log(
          `❌ No images uploaded`
        );

        continue;

      }



      product.images =
        uploadedImages;



      await product.save();



      console.log(
        `🔥 Migrated ${product.name}`
      );



      // INCREMENT CATEGORY COUNTER

      categoryCounters[category]++;

    }



    console.log(
      `\n🎉 IMAGE MIGRATION COMPLETE`
    );



    process.exit();

  } catch (error) {

    console.error(
      "❌ MIGRATION ERROR"
    );

    console.error(error);

    process.exit(1);

  }

};



// ==============================
// RUN
// ==============================

migrateImages();
