import API from "./api";

// Create Razorpay Order
export const createOrder = async (
  amount,
  token
) => {
  const response = await API.post(
    "/payments/create-order",
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};