import express from "express";

const router = express.Router();

import {
  createHotel,
  getHotels,
  getHotelById,
  deleteHotel,
} from "../controllers/hotelController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

// Create Hotel
router.post(
  "/",
  protect,
  admin,
  createHotel
);

// Get All Hotels
router.get("/", getHotels);

// Get Single Hotel
router.get("/:id", getHotelById);

// Delete Hotel
router.delete(
  "/:id",
  protect,
  admin,
  deleteHotel
);

export default router;