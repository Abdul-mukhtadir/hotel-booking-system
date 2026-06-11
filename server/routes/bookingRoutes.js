import express from "express";

import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  sendBookingReminder,
  checkRoomAvailability,
} from "../controllers/bookingController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/all",
  protect,
  getAllBookings
);

router.post(
  "/check-availability",
  protect,
  checkRoomAvailability
);

router.get(
  "/",
  protect,
  getMyBookings
);

router.post(
  "/",
  protect,
  createBooking
);

router.put(
  "/:id",
  protect,
  updateBooking
);

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

router.post(
  "/:id/reminder",
  protect,
  sendBookingReminder
);

export default router;