import express from "express";

import { globalSearch } from "../../controllers/admin/globalSearch.controller.js";
import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(
  protect,
  authorize("admin")
);

router.get(
  "/",
  globalSearch
);

export default router;
