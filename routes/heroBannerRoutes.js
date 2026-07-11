// routes/heroBannerRoutes.js (public)
import express from "express";
import { getPublicHeroBanners } from "../controllers/heroBannerController.js";
const router = express.Router();
router.get("/", getPublicHeroBanners);
export default router;
