import express from "express";

import {
  getAdminCMSPages,
  getAdminCMSPage,
  getPublicCMSPage,
  createAdminCMSPage,
  updateAdminCMSPage,
  deleteAdminCMSPage,
  addCMSPageSection,
  updateCMSPageSection,
  deleteCMSPageSection,
  reorderCMSPageSections,
} from "../../controllers/admin/cms.controller.js";

import { protect, authorize } from "../../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/slug/:slug", getPublicCMSPage);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(getAdminCMSPages)
  .post(createAdminCMSPage);

router
  .route("/:id")
  .get(getAdminCMSPage)
  .patch(updateAdminCMSPage)
  .delete(deleteAdminCMSPage);

router.post("/:id/sections", addCMSPageSection);

router.patch(
  "/:id/sections/reorder",
  reorderCMSPageSections
);

router
  .route("/:id/sections/:sectionId")
  .patch(updateCMSPageSection)
  .delete(deleteCMSPageSection);

export default router;
