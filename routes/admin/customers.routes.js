import express from "express";
import { getCustomers, getCustomerDetails } from "../../controllers/admin/customer.controller.js";
import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";
import {
  exportCustomersReport,
} from "../../controllers/admin/customerExport.controller.js";

const router = express.Router();

router.get(
  "/",

  protect,

  authorize("admin"),

  getCustomers
);

router.get(
  "/export",

  protect,

  authorize("admin"),

  exportCustomersReport
);



router.get(
  "/:id",

  protect,

  authorize("admin"),

  getCustomerDetails
);

export default router;




