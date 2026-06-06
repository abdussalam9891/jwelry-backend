import express from "express";

import {
  getContacts,
  getContactDetails,
  updateContactStatus,
} from "../../controllers/admin/contact.controller.js";

import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router =
  express.Router();

router.use(
  protect,
  authorize("admin")
);

router.get(
  "/",
  getContacts
);

router.get(
  "/:id",
  getContactDetails
);

router.patch(
  "/:id/status",
  updateContactStatus
);

export default router;
