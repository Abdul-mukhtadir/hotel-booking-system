import express from "express";

import {
  addReview,
  getHotelReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);

router.get("/admin/all", protect, admin, getAllReviews);

router.put("/admin/:id", protect, admin, updateReview);

router.delete("/admin/:id", protect, admin, deleteReview);

router.get("/:hotelId", getHotelReviews);

export default router;