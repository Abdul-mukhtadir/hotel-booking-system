import express from "express";

import {
  createOffer,
  getOffers,
  getAllOffers,
  updateOffer,
  deleteOffer,
  applyCoupon,
} from "../controllers/offerController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getOffers);

router.post("/apply", applyCoupon);

router.get(
  "/admin/all",
  protect,
  admin,
  getAllOffers
);

router.post(
  "/",
  protect,
  admin,
  createOffer
);

router.put(
  "/:id",
  protect,
  admin,
  updateOffer
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteOffer
);

export default router;