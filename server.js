import "./config/env.js";

import cors from "cors";
import express from "express";
import dbConnection from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";


const app = express();

const clientUrl = new URL(process.env.CLIENT_URL);
const clientOrigin = `${clientUrl.protocol}//${clientUrl.host}`;

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);

dbConnection();

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
