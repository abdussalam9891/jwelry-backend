import express from "express";

import upload from "../../middleware/uploadMiddleware.js";

import { uploadImages } from "../../controllers/admin/media.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.post("/images", upload.array("images", 5), uploadImages);

export default router;
