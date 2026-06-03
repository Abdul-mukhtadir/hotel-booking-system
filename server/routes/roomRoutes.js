import express from "express";

import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByHotel,
} from "../controllers/roomController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getRooms);

router.get("/:id", getRoomById);

// Admin Routes
router.post("/", protect, admin, createRoom);

router.put("/:id", protect, admin, updateRoom);

router.delete("/:id", protect, admin, deleteRoom);

router.get("/hotel/:hotelId", getRoomsByHotel);

export default router;