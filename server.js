import "./config/env.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import dbConnection from "./config/db.js";
import passport from "./config/passport.js";
import addressRoutes from "./routes/addressRoutes.js";
import adminDashboardRoutes from "./routes/admin/dashboard.routes.js";
import mediaRoutes from "./routes/admin/media.routes.js";
import adminOrdersRoutes from "./routes/admin/orders.routes.js";
import adminProductsRoutes from "./routes/admin/products.routes.js";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cartRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import AdminCustomersRoutes from './routes/admin/customers.routes.js'

const app = express();

// cors

const allowedOrigins = [
  process.env.CLIENT_URL?.trim(),
  process.env.ADMIN_URL?.trim(),
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server
      // or postman
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

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
  }),
);

// public
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/delivery", deliveryRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/orders", orderRoutes);

// admin
app.use("/api/v1/admin/products", adminProductsRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/orders", adminOrdersRoutes);
app.use("/api/v1/admin/media", mediaRoutes);
app.use("/api/v1/admin/customers", AdminCustomersRoutes)

const PORT = process.env.PORT || 5000;

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
