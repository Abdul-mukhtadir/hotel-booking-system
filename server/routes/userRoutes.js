import express from "express";

import {
  getAllUsers,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/userController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/all",
  protect,
  getAllUsers
);

router.get(
  "/favorites",
  protect,
  getFavorites
);

router.post(
  "/favorites/:hotelId",
  protect,
  addFavorite
);

router.delete(
  "/favorites/:hotelId",
  protect,
  removeFavorite
);

export default router;