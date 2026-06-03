import asyncHandler from "express-async-handler";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Hotel Booking System",
        html: `
          <h2>Welcome ${user.name}</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now search hotels, book rooms, save favorites, and manage bookings.</p>
          <br/>
          <p>Thank you for joining us.</p>
        `,
      });
    } catch (error) {
      console.log("Welcome Email Error:", error.message);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  registerUser,
  loginUser,
  getUserProfile,
};