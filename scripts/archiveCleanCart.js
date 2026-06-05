import mongoose from "mongoose";
import dotenv from "dotenv";
import Cart from "../models/cartModel.js";

dotenv.config();

async function cleanCart() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Cart.updateMany(
      {},
      {
        $pull: {
          items: { price: { $exists: false } }
        }
      }
    );

     
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

cleanCart();
