import asyncHandler from "express-async-handler";

import Hotel from "../models/Hotel.js";

import Room from "../models/Room.js";

// Create Hotel
const createHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body);

  res.status(201).json(hotel);
});

// Get All Hotels With Advanced Filters
const getHotels = asyncHandler(async (req, res) => {
  const {
    city,
    search,
    amenity,
    roomType,
    minPrice,
    maxPrice,
    sort,
  } = req.query;

  let hotelQuery = {};

  if (city) {
    hotelQuery.city = {
      $regex: city,
      $options: "i",
    };
  }

  if (search) {
    hotelQuery.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (amenity) {
    hotelQuery.amenities = {
      $in: [amenity],
    };
  }

  let roomQuery = {};

  if (roomType) {
    roomQuery.roomType = roomType;
  }

  if (minPrice || maxPrice) {
    roomQuery.price = {};

    if (minPrice) {
      roomQuery.price.$gte =
        Number(minPrice);
    }

    if (maxPrice) {
      roomQuery.price.$lte =
        Number(maxPrice);
    }
  }

  let hotels = await Hotel.find(hotelQuery);

  if (
    roomType ||
    minPrice ||
    maxPrice
  ) {
    const rooms =
      await Room.find(roomQuery);

    const hotelIds =
      rooms.map((room) =>
        room.hotel.toString()
      );

    hotels = hotels.filter(
      (hotel) =>
        hotelIds.includes(
          hotel._id.toString()
        )
    );
  }

  if (sort === "rating") {
    hotels = hotels.sort(
      (a, b) => b.rating - a.rating
    );
  }

  if (sort === "newest") {
    hotels = hotels.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }

  res.json(hotels);
});

// Get Single Hotel
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404);
    throw new Error("Hotel not found");
  }
});

const deleteHotel = async (req, res) => {
  try {
    const hotel =
      await Hotel.findById(
        req.params.id
      );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    await hotel.deleteOne();

    res.json({
      message:
        "Hotel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createHotel,
  getHotels,
  getHotelById,
  deleteHotel,
};