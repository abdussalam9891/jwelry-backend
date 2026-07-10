import express from "express";
import {
  getAdminCMSPage,
  listAdminCMSPages,
  updateAdminCMSPage,
    deleteCMSPageImage,
  uploadCMSPageImages,
} from "../../controllers/admin/cms.controller.js";
import { authorize, protect } from "../../middleware/authMiddleware.js";
import {
  validateCMSPageUpdate,
  validateSlugParam,
} from "../../validators/cmsPage.validator.js";


import upload, { setUploadFolder } from "../../middleware/uploadMiddleware.js";
import { validateImageUpload } from "../../validators/cmsPage.validator.js";



const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listAdminCMSPages);
router.get("/:slug", validateSlugParam, getAdminCMSPage);
router.put("/:slug", validateSlugParam, validateCMSPageUpdate, updateAdminCMSPage);
router.patch(
  "/:slug/images",
  validateSlugParam,
  setUploadFolder("cms"),
  upload.array("images", 5),
  validateImageUpload,
  uploadCMSPageImages
);

router.delete(
  "/:slug/images",
  validateSlugParam,
  deleteCMSPageImage
);

export default router;










