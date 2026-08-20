import express from "express";

import {
  getAdminCMSPages,
  getAdminCMSPage,
  getPublicCMSPage,
  createAdminCMSPage,
  updateAdminCMSPage,
  deleteAdminCMSPage,

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
router.use(authorize("admin", "demo"));

router
  .route("/")
  .get(getAdminCMSPages)
  .post(authorize("admin"), createAdminCMSPage);

router
  .route("/:id")
  .get(getAdminCMSPage)
  .patch(authorize("admin"), updateAdminCMSPage)
  .delete(authorize("admin"), deleteAdminCMSPage);

 

export default router;
