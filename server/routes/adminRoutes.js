import express from "express";

const router = express.Router();

import {
  getAdminStats,
} from "../controllers/adminController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

router.get(
  "/stats",
  protect,
  admin,
  getAdminStats
);

export default router;