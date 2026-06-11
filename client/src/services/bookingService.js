import API from "./api";

export const checkRoomAvailability = async (availabilityData, token) => {
  const response = await API.post(
    "/bookings/check-availability",
    availabilityData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createBooking = async (bookingData, token) => {
  const response = await API.post("/bookings", bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyBookings = async (token) => {
  const response = await API.get("/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const cancelMyBooking = async (bookingId, token) => {
  const response = await API.put(
    `/bookings/${bookingId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};