import API from "./api";

// Create Booking
export const createBooking = async (
  bookingData,
  token
) => {
  const response = await API.post(
    "/bookings",
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get My Bookings
export const getMyBookings = async (
  token
) => {
  const response = await API.get(
    "/bookings",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};