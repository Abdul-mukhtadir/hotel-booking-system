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

function AdminBookingsPage() {
  const { user } =
    useContext(AuthContext);

  const [bookings, setBookings] =
    useState([]);

  const [editBookingId, setEditBookingId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      checkInDate: "",
      checkOutDate: "",
      guests: "",
      bookingStatus: "Booked",
      paymentStatus: "Pending",
    });

  const fetchBookings = async () => {
    if (!user?.token) return;

    try {
      const response = await API.get(
        "/bookings/all",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setBookings(response.data);
    } catch (err) {
      console.log("Booking Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [user]);

  const formatDateForInput = (date) => {
    return new Date(date)
      .toISOString()
      .split("T")[0];
  };

  const handleEdit = (booking) => {
    setEditBookingId(booking._id);

    setFormData({
      checkInDate: formatDateForInput(booking.checkInDate),
      checkOutDate: formatDateForInput(booking.checkOutDate),
      guests: booking.guests,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateBooking = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        `/bookings/${editBookingId}`,
        {
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          guests: Number(formData.guests),
          bookingStatus: formData.bookingStatus,
          paymentStatus: formData.paymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Booking Updated Successfully");

      setEditBookingId(null);

      setFormData({
        checkInDate: "",
        checkOutDate: "",
        guests: "",
        bookingStatus: "Booked",
        paymentStatus: "Pending",
      });

      fetchBookings();
    } catch (err) {
      console.log("Update Error:", err);
      alert("Booking Update Failed");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await API.put(
        `/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Booking Cancelled Successfully");

      fetchBookings();
    } catch (err) {
      console.log("Cancel Error:", err);
    }
  };

  const sendReminder = async (id) => {
    try {
      await API.post(
        `/bookings/${id}/reminder`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Reminder Email Sent Successfully");
    } catch (err) {
      console.log("Reminder Error:", err);

      alert(
        err.response?.data?.message ||
          "Reminder Email Failed"
      );
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-5xl font-bold mb-10">
          Admin Bookings
        </h1>

        {editBookingId && (
          <form
            onSubmit={updateBooking}
            className="bg-white rounded-xl shadow-md p-6 mb-10"
          >
            <h2 className="text-2xl font-bold mb-4">
              Edit Booking
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                placeholder="Guests"
                className="border p-3 rounded-lg"
                required
              />

              <select
                name="bookingStatus"
                value={formData.bookingStatus}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >
                <option value="Booked">Booked</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Update Booking
              </button>

              <button
                type="button"
                onClick={() => setEditBookingId(null)}
                className="bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel Edit
              </button>
            </div>
          </form>
        )}

        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-2xl font-bold">
                  {booking.hotel?.name}
                </h2>

                <p className="mt-2">
                  User: {booking.user?.name}
                </p>

                <p className="mt-2">
                  Email: {booking.user?.email}
                </p>

                <p className="mt-2">
                  Room: {booking.room?.roomNumber}
                </p>

                <p className="mt-2">
                  Room Type: {booking.room?.roomType}
                </p>

                <p className="mt-2">
                  Check In:{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>

                <p className="mt-2">
                  Check Out:{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>

                <p className="mt-2">
                  Guests: {booking.guests}
                </p>

                <p className="mt-2 font-bold text-blue-600">
                  ₹{booking.totalPrice}
                </p>

                <p className="mt-2">
                  Payment:{" "}
                  <span className="font-bold">
                    {booking.paymentStatus}
                  </span>
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span className="font-bold">
                    {booking.bookingStatus}
                  </span>
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                  >
                    Edit Booking
                  </button>

                  {booking.bookingStatus !== "Cancelled" && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {booking.bookingStatus === "Booked" && (
                    <button
                      onClick={() => sendReminder(booking._id)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                      Send Reminder Email
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminBookingsPage;