import asyncHandler from "express-async-handler";

import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";

// Add Review
const addReview = asyncHandler(async (req, res) => {
  const { hotel, rating, comment } = req.body;

  const existingHotel = await Hotel.findById(hotel);

  if (!existingHotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    hotel,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You already reviewed this hotel");
  }

  const review = await Review.create({
    user: req.user._id,
    hotel,
    rating,
    comment,
    status: "Approved",
  });

  const reviews = await Review.find({
    hotel,
    status: "Approved",
  });

  existingHotel.reviewsCount = reviews.length;

  existingHotel.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await existingHotel.save();

  res.status(201).json(review);
});

// Get Hotel Reviews
const getHotelReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    hotel: req.params.hotelId,
    status: "Approved",
  }).populate("user", "name");

  res.json(reviews);
});

// Admin - Get All Reviews
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("hotel", "name city");

  res.json(reviews);
});

// Admin - Update Review Status / Reply
const updateReview = asyncHandler(async (req, res) => {
  const { status, adminReply } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.status = status || review.status;
  review.adminReply = adminReply ?? review.adminReply;

  const updatedReview = await review.save();

  res.json(updatedReview);
});

// Admin - Delete Review
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  await review.deleteOne();

  res.json({
    message: "Review deleted successfully",
  });
});

export {
  addReview,
  getHotelReviews,
  getAllReviews,
  updateReview,
  deleteReview,
};