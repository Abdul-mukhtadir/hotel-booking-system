import asyncHandler from "express-async-handler";

import Room from "../models/Room.js";

// Create Room
const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);

  res.status(201).json(room);
});

// Get All Rooms
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate("hotel");

  res.json(rooms);
});

// Get Single Room
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("hotel");

  if (room) {
    res.json(room);
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

// Update Room
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    room.roomNumber =
      req.body.roomNumber || room.roomNumber;

    room.roomType =
      req.body.roomType || room.roomType;

    room.description =
      req.body.description || room.description;

    room.price =
      req.body.price || room.price;

    room.capacity =
      req.body.capacity || room.capacity;

    room.amenities =
      req.body.amenities || room.amenities;

    room.images =
      req.body.images || room.images;

    room.isAvailable =
      req.body.isAvailable ?? room.isAvailable;
    room.roomSize =
       req.body.roomSize || room.roomSize;
    room.bedType = 
      req.body.bedType || room.bedType;
    room.roomView = 
      req.body.roomView || room.roomView;  

    const updatedRoom = await room.save();

    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

// Delete Room
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    await room.deleteOne();

    res.json({
      message: "Room removed",
    });
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

// Get Rooms By Hotel
const getRoomsByHotel = asyncHandler(
  async (req, res) => {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
    });

    res.json(rooms);
  }
);

export {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByHotel,
};