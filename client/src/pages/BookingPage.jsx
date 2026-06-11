import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import API from "../services/api";

import {
  createOrder,
} from "../services/paymentService";

import {
  createBooking,
  checkRoomAvailability,
} from "../services/bookingService";

import {
  AuthContext,
} from "../context/AuthContext";

function BookingPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } =
    useContext(AuthContext);

  const [room, setRoom] =
    useState(null);

  const [checkInDate, setCheckInDate] =
    useState("");

  const [
    checkOutDate,
    setCheckOutDate,
  ] = useState("");

  const [guests, setGuests] =
    useState(1);

  const [couponCode, setCouponCode] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [finalAmount, setFinalAmount] =
    useState(null);

  const [appliedCoupon, setAppliedCoupon] =
    useState("");

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const todayDate =
    new Date()
      .toISOString()
      .split("T")[0];

  useEffect(() => {
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const response =
        await API.get(`/rooms/${id}`);

      setRoom(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetCoupon = () => {
    setDiscount(0);
    setFinalAmount(null);
    setAppliedCoupon("");
  };

  const calculateDays = () => {
    if (!checkInDate || !checkOutDate)
      return 1;

    const start =
      new Date(checkInDate);

    const end =
      new Date(checkOutDate);

    const diff =
      end.getTime() -
      start.getTime();

    const days =
      Math.ceil(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );

    return days > 0 ? days : 1;
  };

  const validateBooking = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error(
        "Select check-in and check-out dates"
      );
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn =
      new Date(checkInDate);

    const checkOut =
      new Date(checkOutDate);

    if (checkIn < today) {
      toast.error(
        "Past dates are not allowed"
      );
      return false;
    }

    if (checkOut <= checkIn) {
      toast.error(
        "Check-out date must be after check-in date"
      );
      return false;
    }

    if (!guests || Number(guests) < 1) {
      toast.error(
        "Guests should be at least 1"
      );
      return false;
    }

    if (
      room?.capacity &&
      Number(guests) >
        Number(room.capacity)
    ) {
      toast.error(
        `Maximum ${room.capacity} guests allowed`
      );
      return false;
    }

    return true;
  };

  const checkAvailabilityBeforePayment =
    async () => {
      if (!validateBooking()) {
        return false;
      }

      try {
        setAvailabilityLoading(true);

        await checkRoomAvailability(
          {
            room: room._id,
            checkInDate,
            checkOutDate,
            guests: Number(guests),
          },
          user.token
        );

        return true;
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Room is not available for selected dates"
        );

        return false;
      } finally {
        setAvailabilityLoading(false);
      }
    };

  const totalPrice =
    room?.price *
    calculateDays();

  const payableAmount =
    finalAmount || totalPrice;

  const applyCoupon =
    async () => {
      if (!validateBooking()) {
        return;
      }

      if (!couponCode) {
        toast.error(
          "Enter coupon code"
        );
        return;
      }

      try {
        const response =
          await API.post(
            "/offers/apply",
            {
              code:
                couponCode,
              totalAmount:
                totalPrice,
            }
          );

        setDiscount(
          response.data.discount
        );

        setFinalAmount(
          response.data.finalAmount
        );

        setAppliedCoupon(
          response.data.coupon
        );

        toast.success(
          "Coupon Applied"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Invalid Coupon"
        );
      }
    };

  const handlePayment =
    async () => {
      if (!user) {
        toast.error(
          "Please login first"
        );

        navigate("/login");

        return;
      }

      const isAvailable =
        await checkAvailabilityBeforePayment();

      if (!isAvailable) {
        return;
      }

      try {
        const order =
          await createOrder(
            payableAmount,
            user.token
          );

        const options = {
          key:
            import.meta.env
              .VITE_RAZORPAY_KEY,

          amount:
            order.amount,

          currency:
            order.currency,

          name:
            "Hotel Booking",

          description:
            "Room Booking Payment",

          order_id:
            order.id,

          handler:
            async function () {
              try {
                await createBooking(
                  {
                    hotel:
                      room.hotel,

                    room:
                      room._id,

                    checkInDate,

                    checkOutDate,

                    guests:
                      Number(guests),

                    totalPrice:
                      payableAmount,

                    specialRequests:
                      appliedCoupon
                        ? `Coupon Applied: ${appliedCoupon}`
                        : "",

                    paymentStatus:
                      "Paid",
                  },
                  user.token
                );

                toast.success(
                  "Booking Successful"
                );

                navigate(
                  "/mybookings"
                );
              } catch (error) {
                console.log(error);

                toast.error(
                  error.response?.data
                    ?.message ||
                    "Booking Failed"
                );
              }
            },

          theme: {
            color:
              "#2563eb",
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Payment failed"
        );
      }
    };

  if (!room) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-xl font-semibold text-gray-600">
            Loading booking page...
          </p>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <p className="uppercase tracking-widest text-blue-200 font-semibold">
              Secure Booking
            </p>

            <h1 className="text-5xl font-extrabold mt-3">
              Complete your reservation
            </h1>

            <p className="text-blue-100 mt-4">
              Review your stay details, check availability, apply coupon, and pay securely.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <img
                  src={room.images?.[0]}
                  alt={room.roomType}
                  className="w-full h-96 object-cover"
                />

                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="uppercase tracking-widest text-blue-600 font-semibold">
                        Selected Room
                      </p>

                      <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                        {room.roomType} Room
                      </h2>
                    </div>

                    <div className="bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl font-extrabold text-2xl">
                      ₹{room.price}
                      <span className="text-sm text-gray-500 font-medium">
                        /night
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-gray-600 text-lg leading-relaxed">
                    {room.description}
                  </p>

                  <div className="grid md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500">
                        Room Size
                      </p>
                      <p className="font-bold">
                        {room.roomSize}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500">
                        Bed Type
                      </p>
                      <p className="font-bold">
                        {room.bedType}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500">
                        View
                      </p>
                      <p className="font-bold">
                        {room.roomView}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500">
                        Capacity
                      </p>
                      <p className="font-bold">
                        {room.capacity} Guests
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {room.amenities?.map((item, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
                <h2 className="text-3xl font-extrabold mb-6">
                  Booking Details
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-semibold text-gray-700">
                      Check In
                    </label>

                    <input
                      type="date"
                      min={todayDate}
                      className="w-full border border-gray-300 p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={checkInDate}
                      onChange={(e) => {
                        setCheckInDate(
                          e.target.value
                        );

                        resetCoupon();
                      }}
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      Check Out
                    </label>

                    <input
                      type="date"
                      min={
                        checkInDate ||
                        todayDate
                      }
                      className="w-full border border-gray-300 p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={checkOutDate}
                      onChange={(e) => {
                        setCheckOutDate(
                          e.target.value
                        );

                        resetCoupon();
                      }}
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      Guests
                    </label>

                    <input
                      type="number"
                      min="1"
                      max={room.capacity}
                      className="w-full border border-gray-300 p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={guests}
                      onChange={(e) => {
                        setGuests(
                          Number(
                            e.target.value
                          )
                        );

                        resetCoupon();
                      }}
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      Coupon Code
                    </label>

                    <div className="flex gap-3 mt-2">
                      <input
                        type="text"
                        placeholder="SUMMER20"
                        className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(
                            e.target.value.toUpperCase()
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="bg-green-600 text-white px-6 rounded-2xl font-bold hover:bg-green-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 bg-blue-50 text-blue-700 p-4 rounded-2xl">
                  Availability is checked before payment. If the room is already booked for selected dates, payment will not start.
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-extrabold mb-5">
                  Payment Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">
                      Price / Night
                    </span>
                    <span className="font-bold">
                      ₹{room.price}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">
                      Nights
                    </span>
                    <span className="font-bold">
                      {calculateDays()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">
                      Original Price
                    </span>
                    <span className="font-bold">
                      ₹{totalPrice || 0}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">
                      Discount
                    </span>
                    <span className="font-bold text-green-600">
                      ₹{discount || 0}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-2xl font-bold">
                      Coupon Applied: {appliedCoupon}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-xl font-bold">
                      Payable Amount
                    </span>

                    <span className="text-3xl font-extrabold text-blue-600">
                      ₹{payableAmount || 0}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={availabilityLoading}
                  className={
                    availabilityLoading
                      ? "w-full mt-6 bg-gray-400 text-white py-4 rounded-2xl text-lg font-bold cursor-not-allowed"
                      : "w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-blue-700"
                  }
                >
                  {availabilityLoading
                    ? "Checking Availability..."
                    : "Pay & Book Now"}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingPage;