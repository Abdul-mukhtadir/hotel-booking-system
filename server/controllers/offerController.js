import asyncHandler from "express-async-handler";

import Offer from "../models/Offer.js";

// Create Offer - Admin
const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create(req.body);

  res.status(201).json(offer);
});

// Get Active Offers - Public
const getOffers = asyncHandler(async (req, res) => {
  const currentDate = new Date();

  const offers = await Offer.find({
    isActive: true,
    validFrom: { $lte: currentDate },
    validTo: { $gte: currentDate },
  }).sort({ createdAt: -1 });

  res.json(offers);
});

// Get All Offers - Admin
const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find().sort({
    createdAt: -1,
  });

  res.json(offers);
});

// Update Offer - Admin
const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  offer.title = req.body.title || offer.title;
  offer.code = req.body.code || offer.code;
  offer.discountPercentage =
    req.body.discountPercentage || offer.discountPercentage;
  offer.validFrom = req.body.validFrom || offer.validFrom;
  offer.validTo = req.body.validTo || offer.validTo;
  offer.isActive =
    req.body.isActive ?? offer.isActive;

  const updatedOffer = await offer.save();

  res.json(updatedOffer);
});

// Delete Offer - Admin
const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  await offer.deleteOne();

  res.json({
    message: "Offer deleted successfully",
  });
});

// Apply Coupon - Public
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, totalAmount } = req.body;

  const offer = await Offer.findOne({
    code: code?.toUpperCase(),
    isActive: true,
  });

  if (!offer) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }

  const currentDate = new Date();

  if (
    currentDate < offer.validFrom ||
    currentDate > offer.validTo
  ) {
    res.status(400);
    throw new Error("Coupon is not valid now");
  }

  const discount =
    (Number(totalAmount) * offer.discountPercentage) / 100;

  const finalAmount =
    Number(totalAmount) - discount;

  res.json({
    originalAmount: Number(totalAmount),
    discount,
    finalAmount,
    coupon: offer.code,
  });
});

export {
  createOffer,
  getOffers,
  getAllOffers,
  updateOffer,
  deleteOffer,
  applyCoupon,
};