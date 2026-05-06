import "./config/env.js";

import cors from "cors";
import express from "express";
import dbConnection from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import path from "path";
import reviewRoutes from "./routes/reviewRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import cookieParser from "cookie-parser";



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
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API running...");
});




app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: "7d", // cache
  })
);

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/delivery", deliveryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
