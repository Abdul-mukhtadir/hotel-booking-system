import asyncHandler from "express-async-handler";

import Booking from "../models/Booking.js";

import Room from "../models/Room.js";

import sendEmail from "../utils/sendEmail.js";

// REUSABLE BOOKING VALIDATION
const validateBookingDetails = async ({
  room,
  checkInDate,
  checkOutDate,
  guests,
  totalPrice,
}) => {
  if (
    !room ||
    !checkInDate ||
    !checkOutDate ||
    !guests
  ) {
    return {
      error: "Please select room, dates and guests",
    };
  }

  const selectedRoom =
    await Room.findById(room);

  if (!selectedRoom) {
    return {
      error: "Room not found",
      statusCode: 404,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkIn =
    new Date(checkInDate);

  const checkOut =
    new Date(checkOutDate);

  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime())
  ) {
    return {
      error: "Invalid booking dates",
    };
  }

  if (checkIn < today) {
    return {
      error: "Check-in date cannot be in the past",
    };
  }

  if (checkOut <= checkIn) {
    return {
      error: "Check-out date must be after check-in date",
    };
  }

  if (Number(guests) < 1) {
    return {
      error: "Guests should be at least 1",
    };
  }

  if (
    selectedRoom.capacity &&
    Number(guests) >
      Number(selectedRoom.capacity)
  ) {
    return {
      error: `Maximum ${selectedRoom.capacity} guests allowed`,
    };
  }

  if (
    totalPrice !== undefined &&
    totalPrice !== null &&
    Number(totalPrice) <= 0
  ) {
    return {
      error: "Invalid total price",
    };
  }

  const existingBooking =
    await Booking.findOne({
      room,
      bookingStatus: "Booked",
      $or: [
        {
          checkInDate: {
            $lt: checkOut,
          },
          checkOutDate: {
            $gt: checkIn,
          },
        },
      ],
    });

  if (existingBooking) {
    return {
      error:
        "Room is not available for selected dates",
    };
  }

  return {
    selectedRoom,
    checkIn,
    checkOut,
  };
};

// CHECK ROOM AVAILABILITY BEFORE PAYMENT
const checkRoomAvailability =
  asyncHandler(async (req, res) => {
    const {
      room,
      checkInDate,
      checkOutDate,
      guests,
    } = req.body;

    const validation =
      await validateBookingDetails({
        room,
        checkInDate,
        checkOutDate,
        guests,
      });

    if (validation.error) {
      res.status(
        validation.statusCode || 400
      );
      throw new Error(
        validation.error
      );
    }

    res.json({
      available: true,
      message: "Room is available",
    });
  });

// CREATE BOOKING
const createBooking =
  asyncHandler(async (req, res) => {
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

    if (
      !room ||
      !hotel ||
      !checkInDate ||
      !checkOutDate ||
      !guests ||
      !totalPrice
    ) {
      res.status(400);
      throw new Error(
        "Please fill all booking details"
      );
    }

    const validation =
      await validateBookingDetails({
        room,
        checkInDate,
        checkOutDate,
        guests,
        totalPrice,
      });

    if (validation.error) {
      res.status(
        validation.statusCode || 400
      );
      throw new Error(
        validation.error
      );
    }

    const booking =
      await Booking.create({
        user: req.user._id,
        room,
        hotel,
        checkInDate:
          validation.checkIn,
        checkOutDate:
          validation.checkOut,
        guests:
          Number(guests),
        totalPrice:
          Number(totalPrice),
        specialRequests,
        paymentStatus:
          paymentStatus ||
          "Pending",
      });

    const populatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("hotel")
        .populate("room");

    res.status(201).json(
      populatedBooking
    );

    sendEmail({
      to:
        populatedBooking.user
          .email,
      subject:
        "Booking Confirmation - Hotel Booking System",
      html: `
      <h2>Booking Confirmed</h2>
      <p>Hello <b>${populatedBooking.user.name}</b>,</p>
      <p>Your hotel booking has been confirmed successfully.</p>

      <h3>Booking Details</h3>
      <p><b>Hotel:</b> ${populatedBooking.hotel?.name}</p>
      <p><b>Room:</b> ${populatedBooking.room?.roomType}</p>
      <p><b>Room Number:</b> ${populatedBooking.room?.roomNumber}</p>
      <p><b>Check In:</b> ${new Date(
        populatedBooking.checkInDate
      ).toLocaleDateString()}</p>
      <p><b>Check Out:</b> ${new Date(
        populatedBooking.checkOutDate
      ).toLocaleDateString()}</p>
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
    }).catch((error) => {
      console.log(
        "Booking Email Error:",
        error.message
      );
    });
  });

// GET MY BOOKINGS
const getMyBookings =
  asyncHandler(async (req, res) => {
    const bookings =
      await Booking.find({
        user: req.user._id,
      })
        .populate("hotel")
        .populate("room");

    res.json(bookings);
  });

// GET ALL BOOKINGS ADMIN
const getAllBookings =
  asyncHandler(async (req, res) => {
    const bookings =
      await Booking.find()
        .populate(
          "user",
          "name email"
        )
        .populate("hotel")
        .populate("room");

    res.json(bookings);
  });

// UPDATE BOOKING ADMIN
const updateBooking =
  asyncHandler(async (req, res) => {
    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      res.status(404);
      throw new Error(
        "Booking not found"
      );
    }

    if (
      req.body.checkInDate ||
      req.body.checkOutDate
    ) {
      const newCheckIn =
        req.body.checkInDate
          ? new Date(
              req.body.checkInDate
            )
          : new Date(
              booking.checkInDate
            );

      const newCheckOut =
        req.body.checkOutDate
          ? new Date(
              req.body.checkOutDate
            )
          : new Date(
              booking.checkOutDate
            );

      const today = new Date();
      today.setHours(
        0,
        0,
        0,
        0
      );

      if (
        Number.isNaN(
          newCheckIn.getTime()
        ) ||
        Number.isNaN(
          newCheckOut.getTime()
        )
      ) {
        res.status(400);
        throw new Error(
          "Invalid booking dates"
        );
      }

      if (newCheckIn < today) {
        res.status(400);
        throw new Error(
          "Check-in date cannot be in the past"
        );
      }

      if (
        newCheckOut <=
        newCheckIn
      ) {
        res.status(400);
        throw new Error(
          "Check-out date must be after check-in date"
        );
      }

      booking.checkInDate =
        newCheckIn;
      booking.checkOutDate =
        newCheckOut;
    }

    if (req.body.guests) {
      if (
        Number(
          req.body.guests
        ) < 1
      ) {
        res.status(400);
        throw new Error(
          "Guests should be at least 1"
        );
      }

      booking.guests =
        Number(
          req.body.guests
        );
    }

    booking.bookingStatus =
      req.body.bookingStatus ||
      booking.bookingStatus;

    booking.paymentStatus =
      req.body.paymentStatus ||
      booking.paymentStatus;

    const updatedBooking =
      await booking.save();

    res.json(updatedBooking);
  });

// CANCEL BOOKING
const cancelBooking =
  asyncHandler(async (req, res) => {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("hotel")
        .populate("room");

    if (!booking) {
      res.status(404);
      throw new Error(
        "Booking not found"
      );
    }

    booking.bookingStatus =
      "Cancelled";

    await booking.save();

    res.json({
      message:
        "Booking cancelled successfully",
    });

    sendEmail({
      to: booking.user.email,
      subject:
        "Booking Cancelled - Hotel Booking System",
      html: `
      <h2>Booking Cancelled</h2>
      <p>Hello <b>${booking.user.name}</b>,</p>
      <p>Your booking has been cancelled.</p>

      <h3>Cancelled Booking Details</h3>
      <p><b>Hotel:</b> ${booking.hotel?.name}</p>
      <p><b>Room:</b> ${booking.room?.roomType}</p>
      <p><b>Room Number:</b> ${booking.room?.roomNumber}</p>
      <p><b>Check In:</b> ${new Date(
        booking.checkInDate
      ).toLocaleDateString()}</p>
      <p><b>Check Out:</b> ${new Date(
        booking.checkOutDate
      ).toLocaleDateString()}</p>
      <p><b>Total Amount:</b> ₹${booking.totalPrice}</p>

      <br/>
      <p>If this was a mistake, please contact hotel support.</p>
    `,
    }).catch((error) => {
      console.log(
        "Cancellation Email Error:",
        error.message
      );
    });
  });

// SEND REMINDER EMAIL ADMIN
const sendBookingReminder =
  asyncHandler(async (req, res) => {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("hotel")
        .populate("room");

    if (!booking) {
      res.status(404);
      throw new Error(
        "Booking not found"
      );
    }

    if (
      booking.bookingStatus ===
      "Cancelled"
    ) {
      res.status(400);
      throw new Error(
        "Cannot send reminder for cancelled booking"
      );
    }

    await sendEmail({
      to: booking.user.email,
      subject:
        "Upcoming Reservation Reminder - Hotel Booking System",
      html: `
      <h2>Upcoming Reservation Reminder</h2>

      <p>Hello <b>${booking.user.name}</b>,</p>

      <p>This is a reminder for your upcoming hotel booking.</p>

      <h3>Reservation Details</h3>

      <p><b>Hotel:</b> ${booking.hotel?.name}</p>
      <p><b>Room:</b> ${booking.room?.roomType}</p>
      <p><b>Room Number:</b> ${booking.room?.roomNumber}</p>
      <p><b>Check In:</b> ${new Date(
        booking.checkInDate
      ).toLocaleDateString()}</p>
      <p><b>Check Out:</b> ${new Date(
        booking.checkOutDate
      ).toLocaleDateString()}</p>
      <p><b>Guests:</b> ${booking.guests}</p>
      <p><b>Total Amount:</b> ₹${booking.totalPrice}</p>
      <p><b>Payment Status:</b> ${booking.paymentStatus}</p>

      <br/>
      <p>Please carry a valid ID proof during check-in.</p>
      <p>Thank you for choosing Hotel Booking System.</p>
    `,
    });

    res.json({
      message:
        "Reminder email sent successfully",
    });
  });

export {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  sendBookingReminder,
  checkRoomAvailability,
};