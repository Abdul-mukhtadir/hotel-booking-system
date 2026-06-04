import asyncHandler from "express-async-handler";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phone
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  if (name.trim().length < 3) {
    res.status(400);
    throw new Error("Name must be at least 3 characters");
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please enter a valid email");
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone)) {
    res.status(400);
    throw new Error("Phone number must be exactly 10 digits");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const userExists = await User.findOne({
    email: email.toLowerCase(),
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
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
      console.log(
        "Welcome Email Error:",
        error.message
      );
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
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
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (
    user &&
    (await user.matchPassword(password))
  ) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
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
  const user = await User.findById(
    req.user._id
  ).select("-password");

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