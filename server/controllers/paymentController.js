import asyncHandler from "express-async-handler";

import razorpay from "../config/razorpay.js";

// Create Razorpay Order
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
});

export {
  createPaymentOrder,
};