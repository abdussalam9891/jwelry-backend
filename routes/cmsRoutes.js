import express from "express";
import { getPublicCMSPage } from "../controllers/cmsController.js";

const router = express.Router();

router.get("/:slug", getPublicCMSPage);

export default router;
