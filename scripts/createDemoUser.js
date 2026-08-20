import "../config/env.js";

import crypto from "crypto";
import mongoose from "mongoose";

import User from "../models/UserModel.js";

const DEMO_EMAIL = "demo.gemora@example.com";
const DEMO_NAME = "Demo Viewer";

/*
==========================================
STRONG RANDOM PASSWORD
(crypto.randomInt avoids modulo bias; guarantees
one char from each class so it always passes
typical strength checks)
==========================================
*/
const generatePassword = (length = 20) => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*()-_=+";
  const all = upper + lower + digits + symbols;

  const pick = (charset) => charset[crypto.randomInt(charset.length)];

  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)];

  const rest = Array.from({ length: length - required.length }, () => pick(all));

  const chars = [...required, ...rest];

  // Fisher-Yates shuffle so the required chars aren't always first
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = generatePassword();

    let user = await User.findOne({ email: DEMO_EMAIL }).select("+password");

    if (user) {
      user.name = DEMO_NAME;
      user.role = "demo";
      user.password = password;
      user.isEmailVerified = true;
      user.isActive = true;
      user.isBlocked = false;
      user.provider = user.provider?.includes("email") ? user.provider : ["email"];
      await user.save();
      console.log(`Updated existing demo user: ${DEMO_EMAIL}`);
    } else {
      user = await User.create({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password,
        role: "demo",
        provider: ["email"],
        isEmailVerified: true,
        isActive: true,
      });
      console.log(`Created new demo user: ${DEMO_EMAIL}`);
    }

    console.log("");
    console.log("========================================");
    console.log(" DEMO ACCOUNT CREDENTIALS (save these now)");
    console.log("========================================");
    console.log(`Email:    ${DEMO_EMAIL}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     demo (read-only / limited)`);
    console.log("========================================");
    console.log("This password is not stored anywhere in the repo.");
    console.log("Re-run this script to rotate it at any time.");

    process.exit(0);
  } catch (err) {
    console.error("Failed to create demo user:", err);
    process.exit(1);
  }
};

run();
