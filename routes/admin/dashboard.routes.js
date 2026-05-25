import express from "express";

import { getDashboardData } from "../../controllers/admin/dashboard.controller.js";
import { exportDashboardReport } from "../../controllers/admin/exportReport.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getDashboardData);
router.get("/export", exportDashboardReport);

export default router;
