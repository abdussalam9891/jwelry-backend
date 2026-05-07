import express from "express";

import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createAddress)
  .get(getAddresses);

router.route("/:id")
  .put(updateAddress)
  .delete(deleteAddress);

router.patch("/:id/default", setDefaultAddress);

export default router;
