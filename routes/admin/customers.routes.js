import express from "express";
import {
  getCustomerDetails,
  getCustomers,
} from "../../controllers/admin/customer.controller.js";
import { exportCustomersReport } from "../../controllers/admin/customerExport.controller.js";
import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/", getCustomers);
router.get("/export", exportCustomersReport);
router.get("/:id", getCustomerDetails);

export default router;
