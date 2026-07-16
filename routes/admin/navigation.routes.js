import express from "express";

import { getNavigationOptions } from "../../controllers/admin/navigation.controller.js";

const router = express.Router();

router.get("/options", getNavigationOptions);

export default router;
