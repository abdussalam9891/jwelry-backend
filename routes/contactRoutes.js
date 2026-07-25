import express from "express";

import {
  createContact,
} from "../controllers/contactController.js";

import { publicFormLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", publicFormLimiter, createContact);

export default router;
