import express from "express";

import {
  getDashboardData,

} from "../../controllers/admin/dashboard.controller.js";
import { exportDashboardReport } from "../../controllers/admin/exportReport.controller.js";

import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  getDashboardData
);

router.get(
  "/export",

  protect,

  authorize("admin"),

  exportDashboardReport
);

export default router;
