import API from "./api";

// Check Room Availability Before Payment
export const checkRoomAvailability =
  async (
    availabilityData,
    token
  ) => {
    const response =
      await API.post(
        "/bookings/check-availability",
        availabilityData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

// Create Booking
export const createBooking =
  async (
    bookingData,
    token
  ) => {
    const response =
      await API.post(
        "/bookings",
        bookingData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

// Get My Bookings
export const getMyBookings =
  async (token) => {
    const response =
      await API.get(
        "/bookings",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };