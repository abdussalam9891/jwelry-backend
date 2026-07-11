// routes/admin/heroBanner.routes.js (admin)
import express from "express";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import upload, { setUploadFolder } from "../../middleware/uploadMiddleware.js";
import { validateHeroBannerCreate } from "../../validators/heroBanner.validator.js";
import {
  listAdminHeroBanners,
  createAdminHeroBanner,
  deleteAdminHeroBanner,
} from "../../controllers/admin/heroBanner.controller.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/", listAdminHeroBanners);
router.post(
  "/",
  setUploadFolder("hero-banners"),
  upload.fields([{ name: "desktopImage", maxCount: 1 }, { name: "mobileImage", maxCount: 1 }]),
  validateHeroBannerCreate,
  createAdminHeroBanner
);
router.delete("/:bannerId", deleteAdminHeroBanner);

export default router;
