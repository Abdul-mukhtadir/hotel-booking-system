import asyncHandler from "express-async-handler";

import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

// Admin Dashboard Stats + Analytics
const getAdminStats = asyncHandler(
  async (req, res) => {
    const totalUsers =
      await User.countDocuments();

    const totalHotels =
      await Hotel.countDocuments();

    const totalRooms =
      await Room.countDocuments();

    const totalBookings =
      await Booking.countDocuments();

    const totalReviews =
      await Review.countDocuments();

    const activeBookings =
      await Booking.countDocuments({
        bookingStatus: "Booked",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        bookingStatus: "Cancelled",
      });

    const completedBookings =
      await Booking.countDocuments({
        bookingStatus: "Completed",
      });

    const paidBookings =
      await Booking.find({
        bookingStatus: {
          $ne: "Cancelled",
        },
      });

    const totalRevenue =
      paidBookings.reduce(
        (acc, booking) =>
          acc + booking.totalPrice,
        0
      );

    const occupancyRate =
      totalRooms === 0
        ? 0
        : Math.round(
            (activeBookings / totalRooms) *
              100
          );

    const recentBookings =
      await Booking.find()
        .populate("user", "name email")
        .populate("hotel", "name city")
        .populate(
          "room",
          "roomNumber roomType"
        )
        .sort({ createdAt: -1 })
        .limit(5);

    const recentReviews =
      await Review.find()
        .populate("user", "name email")
        .populate("hotel", "name city")
        .sort({ createdAt: -1 })
        .limit(5);

    const monthlyData =
      await Booking.aggregate([
        {
          $match: {
            bookingStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
              year: {
                $year: "$createdAt",
              },
            },
            bookings: {
              $sum: 1,
            },
            revenue: {
              $sum: "$totalPrice",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    const monthlyStats =
      monthlyData.map((item) => ({
        month: `${item._id.month}/${item._id.year}`,
        bookings: item.bookings,
        revenue: item.revenue,
      }));

    const reviewRatingData =
      await Review.aggregate([
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const reviewStats =
      reviewRatingData.map((item) => ({
        rating: `${item._id} Star`,
        count: item.count,
      }));

    const bookingStatusStats = [
      {
        status: "Booked",
        count: activeBookings,
      },
      {
        status: "Cancelled",
        count: cancelledBookings,
      },
      {
        status: "Completed",
        count: completedBookings,
      },
    ];

    res.json({
      totalUsers,
      totalHotels,
      totalRooms,
      totalBookings,
      totalReviews,
      activeBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue,
      occupancyRate,
      recentBookings,
      recentReviews,
      monthlyStats,
      reviewStats,
      bookingStatusStats,
    });
  }
);

export { getAdminStats };