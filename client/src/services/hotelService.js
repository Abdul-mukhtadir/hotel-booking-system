import API from "./api";

// Get All Hotels
export const getHotels = async (
  city = "",
  search = "",
  amenity = "",
  roomType = "",
  minPrice = "",
  maxPrice = "",
  sort = ""
) => {
  const response = await API.get(
    `/hotels?city=${city}&search=${search}&amenity=${amenity}&roomType=${roomType}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`
  );

  return response.data;
};

// Get Single Hotel
export const getHotelById = async (id) => {
  const response = await API.get(
    `/hotels/${id}`
  );

  return response.data;
};

// Get Rooms By Hotel
export const getRoomsByHotel = async (
  hotelId
) => {
  const response = await API.get(
    `/rooms/hotel/${hotelId}`
  );

  return response.data;
};