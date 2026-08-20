import express from "express";

import { getDashboardData } from "../../controllers/admin/dashboard.controller.js";
import { exportDashboardReport } from "../../controllers/admin/exportReport.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin", "demo"));

router.get("/", getDashboardData);
router.get("/export", authorize("admin"), exportDashboardReport);

export default router;
