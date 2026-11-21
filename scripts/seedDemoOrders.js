/*
  Seeds realistic demo orders spread across the last N days so admin
  analytics (revenue, orders, funnel, payments, geo) has data.

  - Uses the real checkout steps (checkStock -> buildOrderItems ->
    calculatePricing -> createOrder -> deductStock).
  - Skips customer emails / notifications.
  - Backdates createdAt and writes a realistic statusHistory
    (PLACED -> CONFIRMED -> SHIPPED -> DELIVERED / CANCELLED).
  - Every seeded order is tagged adminNotes = "[SEED]"
    -> remove with: node scripts/removeSeedOrders.js

  Usage: node scripts/seedDemoOrders.js [count=30] [days=15]
*/
import "../config/env.js";
import mongoose from "mongoose";

import User from "../models/UserModel.js";
import Address from "../models/addressModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

import { checkStock, deductStock } from "../service/order/inventoryService.js";
import { buildOrderItems } from "../service/order/cartService.js";
import { calculatePricing } from "../service/order/pricingService.js";
import { createOrder } from "../service/order/orderService.js";

const COUNT = Number(process.argv[2]) || 30;
const DAYS = Number(process.argv[3]) || 15;

// Owner / test accounts only
const CUSTOMER_IDS = [
  "6a103d8a4b449aa0f0914a0f", // Abdusss
  "6a2173402bb03c63dbbc5f18", // Yash
  "6a22ada9b220fdbfe5e7f592", // Tanish
  "6a22c3d5744304e525c0a648", // Rohit
];

const CARRIERS = ["Delhivery", "Blue Dart", "DTDC", "Ekart"];

const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

function weighted(options) {
  const total = options.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of options) {
    if ((r -= w) < 0) return v;
  }
  return options[0][0];
}

function finalStatusFor(ageDays) {
  if (ageDays >= 7)
    return weighted([["DELIVERED", 75], ["CANCELLED", 12], ["SHIPPED", 13]]);
  if (ageDays >= 3)
    return weighted([["SHIPPED", 45], ["CONFIRMED", 25], ["DELIVERED", 20], ["CANCELLED", 10]]);
  return weighted([["PLACED", 50], ["CONFIRMED", 40], ["CANCELLED", 10]]);
}

function buildHistory(createdAt, finalStatus, now) {
  const history = [{ status: "PLACED", changedAt: createdAt }];
  if (finalStatus === "PLACED") return history;

  let t = new Date(createdAt.getTime() + rand(1, 8) * HOUR);
  const cap = (d) => (d > now ? new Date(now.getTime() - rand(5, 60) * 60000) : d);

  if (finalStatus === "CANCELLED") {
    history.push({ status: "CANCELLED", changedAt: cap(t) });
    return history;
  }

  history.push({ status: "CONFIRMED", changedAt: cap(t) });
  if (finalStatus === "CONFIRMED") return history;

  t = new Date(t.getTime() + rand(0.6, 2) * DAY);
  history.push({ status: "SHIPPED", changedAt: cap(t) });
  if (finalStatus === "SHIPPED") return history;

  t = new Date(t.getTime() + rand(1.5, 4) * DAY);
  history.push({ status: "DELIVERED", changedAt: cap(t) });
  return history;
}

function pickLineItems(products) {
  const n = weighted([[1, 60], [2, 30], [3, 10]]);
  const items = [];
  const used = new Set();

  for (let tries = 0; items.length < n && tries < 50; tries++) {
    const p = pick(products);
    if (used.has(String(p._id))) continue;

    const qty = weighted([[1, 85], [2, 15]]);

    if (p.variants?.length) {
      const v = p.variants.filter((v) => v.stock >= qty + 1 && v.price >= 1000);
      if (!v.length) continue;
      items.push({ product: p, variantId: pick(v)._id, quantity: qty });
    } else {
      if (p.stock < qty + 1 || p.price < 1000) continue;
      items.push({ product: p, variantId: null, quantity: qty });
    }
    used.add(String(p._id));
  }
  return items;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const now = new Date();
  const users = await User.find({ _id: { $in: CUSTOMER_IDS } });
  const addresses = await Address.find({ user: { $in: CUSTOMER_IDS } }).lean();

  // spread orders over the window, newest days slightly busier
  const dates = Array.from({ length: COUNT }, () => {
    const ageDays = Math.pow(Math.random(), 1.15) * DAYS;
    const d = new Date(now.getTime() - ageDays * DAY);
    // shop hours 09:00-22:30 IST (UTC+5:30)
    const istMinutes = randInt(9 * 60, 22 * 60 + 30);
    d.setUTCHours(0, 0, 0, 0);
    d.setTime(d.getTime() + (istMinutes - 330) * 60000);
    if (d > now) d.setTime(now.getTime() - rand(10, 120) * 60000);
    return d;
  }).sort((a, b) => a - b);

  const summary = [];

  for (const createdAt of dates) {
    const products = await Product.find({ status: "ACTIVE" });
    const user = pick(users);
    const userAddrs = addresses.filter((a) => String(a.user) === String(user._id));
    const address = pick(userAddrs);
    const paymentMethod = Math.random() < 0.6 ? "RAZORPAY" : "COD";

    const ctx = {
      user,
      address,
      paymentMethod,
      cart: { items: pickLineItems(products) },
    };
    if (!ctx.cart.items.length) continue;

    await checkStock(ctx);
    buildOrderItems(ctx);
    ctx.discountAmount = 0;
    ctx.couponSnapshot = null;
    ctx.pricing = calculatePricing(ctx);

    const order = await createOrder(ctx);

    const ageDays = (now - createdAt) / DAY;
    const finalStatus = finalStatusFor(ageDays);
    const statusHistory = buildHistory(createdAt, finalStatus, now);
    const last = statusHistory[statusHistory.length - 1];

    let paymentStatus = "PENDING";
    let paidAt;
    const set = {};

    if (paymentMethod === "RAZORPAY") {
      paymentStatus = finalStatus === "CANCELLED" ? "REFUNDED" : "PAID";
      paidAt = new Date(createdAt.getTime() + rand(1, 4) * 60000);
      set.paymentGatewayOrderId = `order_SEED${createdAt.getTime().toString(36)}`;
      set.paymentGatewayPaymentId = `pay_SEED${Math.random().toString(36).slice(2, 12)}`;
      set.paymentAttempts = 1;
    } else if (finalStatus === "DELIVERED") {
      paymentStatus = "PAID";
      paidAt = last.changedAt;
    }

    if (["SHIPPED", "DELIVERED"].includes(finalStatus)) {
      set.shippingCarrier = pick(CARRIERS);
      set.trackingNumber = `TRK${randInt(10000000, 99999999)}`;
    }
    if (finalStatus === "DELIVERED") set.deliveredAt = last.changedAt;
    if (finalStatus === "CANCELLED")
      set.cancelReason = pick(["Customer requested cancellation", "Ordered by mistake", "Found a better price"]);

    await Order.collection.updateOne(
      { _id: order._id },
      {
        $set: {
          ...set,
          orderNumber: `ORD-${createdAt.getTime()}-${randInt(1000, 9999)}`,
          orderStatus: finalStatus,
          paymentStatus,
          ...(paidAt ? { paidAt } : {}),
          statusHistory: statusHistory.map((h) => ({ ...h, _id: new mongoose.Types.ObjectId() })),
          adminNotes: "[SEED]",
          createdAt,
          updatedAt: last.changedAt,
        },
      }
    );

    // cancelled orders had stock restored -> net effect: don't deduct
    if (finalStatus !== "CANCELLED") await deductStock(ctx);

    summary.push({
      date: createdAt.toISOString().slice(0, 16).replace("T", " "),
      customer: user.name,
      city: address.city,
      items: order.items.length,
      total: order.totalPrice,
      method: paymentMethod,
      payment: paymentStatus,
      status: finalStatus,
    });
  }

  console.table(summary);
  const paid = summary.filter((s) => s.payment === "PAID");
  console.log(
    `Seeded ${summary.length} orders | paid revenue ₹${paid
      .reduce((s, o) => s + o.total, 0)
      .toLocaleString("en-IN")} from ${paid.length} paid orders`
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
