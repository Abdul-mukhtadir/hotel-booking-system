import API from "./api";

// Get Single Room
export const getRoomById = async (id) => {
  const response = await API.get(`/rooms/${id}`);

  return response.data;
};