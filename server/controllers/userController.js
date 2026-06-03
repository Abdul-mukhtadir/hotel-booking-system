import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

// Admin - Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  res.json(users);
});

// Add Hotel To Favorites
const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const hotel = await Hotel.findById(req.params.hotelId);

  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  const alreadyFavorite = user.favorites.some(
    (fav) => fav.toString() === req.params.hotelId
  );

  if (alreadyFavorite) {
    return res.json({
      message: "Hotel already in favorites",
    });
  }

  user.favorites.push(req.params.hotelId);

  await user.save();

  res.json({
    message: "Hotel added to favorites",
  });
});

// Remove Hotel From Favorites
const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.favorites = user.favorites.filter(
    (fav) => fav.toString() !== req.params.hotelId
  );

  await user.save();

  res.json({
    message: "Hotel removed from favorites",
  });
});

// Get User Favorites
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");

  res.json(user.favorites);
});

export {
  getAllUsers,
  addFavorite,
  removeFavorite,
  getFavorites,
};