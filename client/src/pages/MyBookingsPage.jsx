import {
  useEffect,
  useState,
  useContext,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getMyBookings,
} from "../services/bookingService";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  downloadInvoice,
} from "../utils/invoiceGenerator";

function MyBookingsPage() {
  const { user } =
    useContext(AuthContext);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings =
    async () => {
      if (!user?.token) return;

      try {
        setLoading(true);

        const data =
          await getMyBookings(
            user.token
          );

        setBookings(data);
      } catch (error) {
        console.log(
          "Booking Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const today = new Date();

  const upcomingBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus !==
          "Cancelled" &&
        new Date(
          booking.checkInDate
        ) >= today
    );

  const pastBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus !==
          "Cancelled" &&
        new Date(
          booking.checkOutDate
        ) < today
    );

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "Cancelled"
    );

  const BookingCard = ({
    booking,
  }) => (
    <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {booking.hotel?.name}
            </h2>

            <p className="mt-2 text-blue-600 font-semibold">
              {booking.room?.roomType} Room
            </p>
          </div>

          <p className="text-3xl font-extrabold text-blue-600">
            ₹{booking.totalPrice}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-xs text-gray-500">
              Check In
            </p>
            <p className="font-bold">
              {new Date(
                booking.checkInDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-xs text-gray-500">
              Check Out
            </p>
            <p className="font-bold">
              {new Date(
                booking.checkOutDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-xs text-gray-500">
              Guests
            </p>
            <p className="font-bold">
              {booking.guests}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-xs text-gray-500">
              Booking ID
            </p>
            <p className="font-bold text-sm">
              {booking._id?.slice(-8)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={() =>
              downloadInvoice(
                booking
              )
            }
            className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700"
          >
            Download Invoice
          </button>

          <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold">
            {booking.paymentStatus}
          </span>

          <span
            className={
              booking.bookingStatus ===
              "Cancelled"
                ? "bg-red-50 text-red-700 px-4 py-2 rounded-full font-bold"
                : "bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold"
            }
          >
            {booking.bookingStatus}
          </span>
        </div>
      </div>
    </div>
  );

  const BookingSection = ({
    title,
    subtitle,
    data,
  }) => (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {title}
          </h2>

          <p className="text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>

        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold">
          {data.length}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-8 text-gray-600">
          No bookings in this section.
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <p className="uppercase tracking-widest text-blue-200 font-semibold">
              Reservations
            </p>

            <h1 className="text-5xl font-extrabold mt-3">
              My Bookings
            </h1>

            <p className="text-blue-100 mt-4">
              Track upcoming, past, and cancelled reservations.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="bg-white rounded-3xl p-10 shadow text-center">
              <p className="text-gray-600 text-lg">
                Loading bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 shadow text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                No bookings found
              </h2>

              <p className="text-gray-600 mt-3">
                Your reservations will appear here after booking.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              <BookingSection
                title="Upcoming Reservations"
                subtitle="Your future confirmed stays"
                data={upcomingBookings}
              />

              <BookingSection
                title="Past Reservations"
                subtitle="Completed or older stays"
                data={pastBookings}
              />

              <BookingSection
                title="Cancelled Reservations"
                subtitle="Bookings cancelled by user or admin"
                data={cancelledBookings}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyBookingsPage;