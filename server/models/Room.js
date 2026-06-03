import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Suite", "Deluxe"],
      required: true,
    },

    description: {
      type: String,
    },

    roomSize: {
      type: String,
      default: "250 sq.ft",
    },

    bedType: {
      type: String,
      default: "Queen Bed",
    },

    roomView: {
      type: String,
      default: "City View",
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;