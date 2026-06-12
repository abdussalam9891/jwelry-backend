import express from "express";

import {
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionById,
  getAdminCollections,
} from "../../controllers/admin/collection.controller.js";

import { protect, authorize} from "../../middleware/authMiddleware.js";

const router =
  express.Router();

  router.use(protect, authorize("admin"));

router.get(
  "/",
  getAdminCollections
);

router.get(
  "/:id",
  getCollectionById
);

router.post(
  "/",
  createCollection
);

router.patch(
  "/:id",
  updateCollection
);

router.delete(
  "/:id",
  deleteCollection
);

export default router;
