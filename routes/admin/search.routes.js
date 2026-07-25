import express from "express";

import { globalSearch } from "../../controllers/admin/globalSearch.controller.js";
import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";
import { searchLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();

router.use(
  protect,
  authorize("admin")
);

router.get(
  "/",
  searchLimiter,
  globalSearch
);

export default router;
