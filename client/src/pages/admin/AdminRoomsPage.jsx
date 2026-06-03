import {
  useEffect,
  useState,
  useContext,
} from "react";

import API from "../../services/api";

import {
  AuthContext,
} from "../../context/AuthContext";

import AdminLayout from "../../components/AdminLayout";

function AdminRoomsPage() {
  const { user } =
    useContext(AuthContext);

  const [rooms, setRooms] =
    useState([]);

  const [hotels, setHotels] =
    useState([]);

  const [editRoomId, setEditRoomId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      hotel: "",
      roomNumber: "",
      roomType: "Deluxe",
      description: "",
      roomSize: "",
      bedType: "",
      roomView: "",
      price: "",
      capacity: "",
      image: "",
    });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms =
    async () => {
      try {
        const response =
          await API.get("/rooms");

        setRooms(response.data);
      } catch (err) {
        console.log(err);
      }
    };

  const fetchHotels =
    async () => {
      try {
        const response =
          await API.get("/hotels");

        setHotels(response.data);
      } catch (err) {
        console.log(err);
      }
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const editRoom = (room) => {
    setEditRoomId(room._id);

    setFormData({
      hotel:
        room.hotel?._id ||
        room.hotel,

      roomNumber:
        room.roomNumber,

      roomType:
        room.roomType,

      description:
        room.description,

      roomSize:
        room.roomSize || "",

      bedType:
        room.bedType || "",

      roomView:
        room.roomView || "",

      price:
        room.price,

      capacity:
        room.capacity,

      image:
        room.images?.[0] || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const roomData = {
        hotel:
          formData.hotel,

        roomNumber:
          formData.roomNumber,

        roomType:
          formData.roomType,

        description:
          formData.description,

        roomSize:
          formData.roomSize,

        bedType:
          formData.bedType,

        roomView:
          formData.roomView,

        price:
          Number(formData.price),

        capacity:
          Number(formData.capacity),

        amenities: [
          "AC",
          "WiFi",
          "TV",
        ],

        images: [
          formData.image,
        ],
      };

      try {
        if (editRoomId) {
          await API.put(
            `/rooms/${editRoomId}`,
            roomData,
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

          alert(
            "Room Updated Successfully"
          );
        } else {
          await API.post(
            "/rooms",
            roomData,
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

          alert(
            "Room Added Successfully"
          );
        }

        setEditRoomId(null);

        setFormData({
          hotel: "",
          roomNumber: "",
          roomType: "Deluxe",
          description: "",
          roomSize: "",
          bedType: "",
          roomView: "",
          price: "",
          capacity: "",
          image: "",
        });

        fetchRooms();
      } catch (err) {
        console.log(err);

        alert(
          "Operation Failed"
        );
      }
    };

  const deleteRoom =
    async (id) => {
      try {
        await API.delete(
          `/rooms/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        fetchRooms();
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <AdminLayout>
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8">
          Admin Rooms
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="hotel"
              value={formData.hotel}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            >
              <option value="">
                Select Hotel
              </option>

              {hotels.map((hotel) => (
                <option
                  key={hotel._id}
                  value={hotel._id}
                >
                  {hotel.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Single</option>
              <option>Double</option>
            </select>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="roomSize"
              placeholder="Room Size e.g. 300 sq.ft"
              value={formData.roomSize}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="bedType"
              placeholder="Bed Type e.g. King Bed"
              value={formData.bedType}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="roomView"
              placeholder="Room View e.g. Sea View"
              value={formData.roomView}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="border p-3 rounded-lg w-full mt-4"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4"
          >
            {editRoomId
              ? "Update Room"
              : "Add Room"}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={room.images?.[0]}
                alt={room.roomType}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">
                  {room.roomType}
                </h2>

                <p className="mt-2">
                  Room No: {room.roomNumber}
                </p>

                <p className="mt-2">
                  Size: {room.roomSize}
                </p>

                <p className="mt-2">
                  Bed: {room.bedType}
                </p>

                <p className="mt-2">
                  View: {room.roomView}
                </p>

                <p className="mt-2 font-bold text-blue-600">
                  ₹ {room.price}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      editRoom(room)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteRoom(room._id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminRoomsPage;