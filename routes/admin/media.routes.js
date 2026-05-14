import express from "express";

import upload from
  "../../middleware/uploadMiddleware.js";

import {
  uploadImages,
} from
  "../../controllers/admin/media.controller.js";

import {
  protect,
  authorize,
} from
  "../../middleware/authMiddleware.js";

const router =
  express.Router();



router.post(

  "/images",

  protect,

  authorize("admin"),

  upload.array("images", 5),

  uploadImages
);



export default router;
