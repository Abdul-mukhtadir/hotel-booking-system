import express from "express";

import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByHotel,
} from "../controllers/roomController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getRooms);

// IMPORTANT: keep this before "/:id"
router.get(
  "/hotel/:hotelId",
  getRoomsByHotel
);

router.get("/:id", getRoomById);

// Admin Routes
router.post(
  "/",
  protect,
  admin,
  createRoom
);

router.put(
  "/:id",
  protect,
  admin,
  updateRoom
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteRoom
);

export default router;