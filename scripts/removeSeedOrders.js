/*
  Removes orders created by seedDemoOrders.js (adminNotes = "[SEED]")
  and returns their stock (cancelled seed orders never deducted stock).

  Usage: node scripts/removeSeedOrders.js
*/
import "../config/env.js";
import mongoose from "mongoose";

import Order from "../models/orderModel.js";
import { restoreStock } from "../service/order/inventoryService.js";

await mongoose.connect(process.env.MONGO_URI);

const orders = await Order.find({ adminNotes: "[SEED]" });

for (const order of orders) {
  if (order.orderStatus !== "CANCELLED") {
    await restoreStock({ order });
  }
  await order.deleteOne();
}

console.log(`Removed ${orders.length} seed orders`);
await mongoose.disconnect();
