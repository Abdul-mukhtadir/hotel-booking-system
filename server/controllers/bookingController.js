import asyncHandler from "express-async-handler";

import Booking from "../models/Booking.js";

import sendEmail from "../utils/sendEmail.js";

// CREATE BOOKING
const createBooking = asyncHandler(async (req, res) => {
  const {
    room,
    hotel,
    checkInDate,
    checkOutDate,
    guests,
    totalPrice,
    specialRequests,
    paymentStatus,
  } = req.body;

  const existingBooking = await Booking.findOne({
    room,
    bookingStatus: "Booked",
    $or: [
      {
        checkInDate: {
          $lte: new Date(checkOutDate),
        },
        checkOutDate: {
          $gte: new Date(checkInDate),
        },
      },
    ],
  });

  if (existingBooking) {
    res.status(400);
    throw new Error("Room already booked for selected dates");
  }

  const booking = await Booking.create({
    user: req.user._id,
    room,
    hotel,
    checkInDate,
    checkOutDate,
    guests,
    totalPrice,
    specialRequests,
    paymentStatus: paymentStatus || "Pending",
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("user", "name email")
    .populate("hotel")
    .populate("room");

  try {
    await sendEmail({
      to: populatedBooking.user.email,
      subject: "Booking Confirmation - Hotel Booking System",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hello <b>${populatedBooking.user.name}</b>,</p>
        <p>Your hotel booking has been confirmed successfully.</p>

        <h3>Booking Details</h3>
        <p><b>Hotel:</b> ${populatedBooking.hotel?.name}</p>
        <p><b>Room:</b> ${populatedBooking.room?.roomType}</p>
        <p><b>Room Number:</b> ${populatedBooking.room?.roomNumber}</p>
        <p><b>Check In:</b> ${new Date(populatedBooking.checkInDate).toLocaleDateString()}</p>
        <p><b>Check Out:</b> ${new Date(populatedBooking.checkOutDate).toLocaleDateString()}</p>
        <p><b>Guests:</b> ${populatedBooking.guests}</p>
        <p><b>Total Amount:</b> ₹${populatedBooking.totalPrice}</p>
        <p><b>Payment Status:</b> ${populatedBooking.paymentStatus}</p>
        <p><b>Booking Status:</b> ${populatedBooking.bookingStatus}</p>

        ${
          populatedBooking.specialRequests
            ? `<p><b>Special Request:</b> ${populatedBooking.specialRequests}</p>`
            : ""
        }

        <br/>
        <p>Thank you for booking with us.</p>
      `,
    });
  } catch (error) {
    console.log("Booking Email Error:", error.message);
  }

  res.status(201).json(populatedBooking);
});

// GET MY BOOKINGS
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate("hotel")
    .populate("room");

  res.json(bookings);
});

// GET ALL BOOKINGS ADMIN
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("hotel")
    .populate("room");

  res.json(bookings);
});

// UPDATE BOOKING ADMIN
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.checkInDate = req.body.checkInDate || booking.checkInDate;
  booking.checkOutDate = req.body.checkOutDate || booking.checkOutDate;
  booking.guests = req.body.guests || booking.guests;
  booking.bookingStatus = req.body.bookingStatus || booking.bookingStatus;
  booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;

  const updatedBooking = await booking.save();

  res.json(updatedBooking);
});

// CANCEL BOOKING
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("hotel")
    .populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.bookingStatus = "Cancelled";

  await booking.save();

  try {
    await sendEmail({
      to: booking.user.email,
      subject: "Booking Cancelled - Hotel Booking System",
      html: `
        <h2>Booking Cancelled</h2>
        <p>Hello <b>${booking.user.name}</b>,</p>
        <p>Your booking has been cancelled.</p>

        <h3>Cancelled Booking Details</h3>
        <p><b>Hotel:</b> ${booking.hotel?.name}</p>
        <p><b>Room:</b> ${booking.room?.roomType}</p>
        <p><b>Room Number:</b> ${booking.room?.roomNumber}</p>
        <p><b>Check In:</b> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
        <p><b>Check Out:</b> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
        <p><b>Total Amount:</b> ₹${booking.totalPrice}</p>

        <br/>
        <p>If this was a mistake, please contact hotel support.</p>
      `,
    });
  } catch (error) {
    console.log("Cancellation Email Error:", error.message);
  }

  res.json({
    message: "Booking cancelled successfully",
  });
});

// SEND REMINDER EMAIL ADMIN
const sendBookingReminder = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("hotel")
    .populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.bookingStatus === "Cancelled") {
    res.status(400);
    throw new Error("Cannot send reminder for cancelled booking");
  }

  await sendEmail({
    to: booking.user.email,
    subject: "Upcoming Reservation Reminder - Hotel Booking System",
    html: `
      <h2>Upcoming Reservation Reminder</h2>

      <p>Hello <b>${booking.user.name}</b>,</p>

      <p>This is a reminder for your upcoming hotel booking.</p>

      <h3>Reservation Details</h3>

      <p><b>Hotel:</b> ${booking.hotel?.name}</p>
      <p><b>Room:</b> ${booking.room?.roomType}</p>
      <p><b>Room Number:</b> ${booking.room?.roomNumber}</p>
      <p><b>Check In:</b> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
      <p><b>Check Out:</b> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
      <p><b>Guests:</b> ${booking.guests}</p>
      <p><b>Total Amount:</b> ₹${booking.totalPrice}</p>
      <p><b>Payment Status:</b> ${booking.paymentStatus}</p>

      <br/>
      <p>Please carry a valid ID proof during check-in.</p>
      <p>Thank you for choosing Hotel Booking System.</p>
    `,
  });

  res.json({
    message: "Reminder email sent successfully",
  });
});

export {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  sendBookingReminder,
};