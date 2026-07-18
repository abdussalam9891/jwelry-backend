import express from "express";
import { getPublicAnnouncementBar } from "../controllers/announcementBarController.js";

const router = express.Router();

router.get("/", getPublicAnnouncementBar);

export default router;
