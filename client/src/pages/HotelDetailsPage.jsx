import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getHotelById,
  getRoomsByHotel,
} from "../services/hotelService";

import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/userService";

import {
  AuthContext,
} from "../context/AuthContext";

function HotelDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [hotel, setHotel] = useState(null);

  const [rooms, setRooms] = useState([]);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchHotel();
    fetchRooms();

    if (user?.token) {
      checkFavorite();
    }
  }, [id, user]);

  const fetchHotel = async () => {
    try {
      const data = await getHotelById(id);
      setHotel(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await getRoomsByHotel(id);
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkFavorite = async () => {
    try {
      const favorites = await getFavorites(user.token);

      const exists = favorites.some((fav) => fav._id === id);

      setIsFavorite(exists);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(id, user.token);
        setIsFavorite(false);
      } else {
        await addFavorite(id, user.token);
        setIsFavorite(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!hotel) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-xl font-semibold text-gray-600">
            Loading hotel details...
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
        <div className="relative h-[520px]">
          <img
            src={hotel.images?.[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 pb-12 text-white">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <p className="uppercase tracking-widest text-blue-200 font-semibold mb-3">
                    Hotel Details
                  </p>

                  <h1 className="text-5xl md:text-6xl font-extrabold">
                    {hotel.name}
                  </h1>

                  <p className="text-xl text-blue-100 mt-3">
                    📍 {hotel.city}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                      ⭐ {hotel.rating || 0} Rating
                    </span>

                    <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                      {hotel.reviewsCount || 0} Reviews
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleFavorite}
                  className={
                    isFavorite
                      ? "bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 shadow-lg"
                      : "bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 shadow-lg"
                  }
                >
                  {isFavorite ? "♥ Remove Favorite" : "♡ Add Favorite"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-md p-8 mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                  About this hotel
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {hotel.description}
                </p>

                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">
                    Amenities
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {hotel.amenities?.length > 0 ? (
                      hotel.amenities.map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No amenities listed
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Available Rooms
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300"
                  >
                    <div className="relative">
                      <img
                        src={room.images?.[0]}
                        alt={room.roomType}
                        className="w-full h-64 object-cover"
                      />

                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-blue-700">
                        {room.roomType}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-extrabold text-gray-900">
                        {room.roomType} Room
                      </h3>

                      <p className="mt-3 text-gray-600 leading-relaxed">
                        {room.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="bg-gray-50 p-3 rounded-2xl">
                          <p className="text-xs text-gray-500">
                            Size
                          </p>
                          <p className="font-bold">
                            {room.roomSize}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-2xl">
                          <p className="text-xs text-gray-500">
                            Bed
                          </p>
                          <p className="font-bold">
                            {room.bedType}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-2xl">
                          <p className="text-xs text-gray-500">
                            View
                          </p>
                          <p className="font-bold">
                            {room.roomView}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-2xl">
                          <p className="text-xs text-gray-500">
                            Guests
                          </p>
                          <p className="font-bold">
                            {room.capacity}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {room.amenities?.map((item, index) => (
                          <span
                            key={index}
                            className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div>
                          <p className="text-sm text-gray-500">
                            Starting from
                          </p>

                          <p className="text-3xl font-extrabold text-blue-600">
                            ₹{room.price}
                            <span className="text-sm text-gray-500 font-medium">
                              /night
                            </span>
                          </p>
                        </div>

                        <Link
                          to={`/booking/${room._id}`}
                          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-md p-6 sticky top-24">
                <h3 className="text-2xl font-extrabold mb-4">
                  Why book with us?
                </h3>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <p className="font-bold text-blue-700">
                      Secure Payments
                    </p>
                    <p className="text-gray-600 text-sm">
                      Pay safely using integrated Razorpay checkout.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-2xl">
                    <p className="font-bold text-green-700">
                      Instant Confirmation
                    </p>
                    <p className="text-gray-600 text-sm">
                      Receive booking confirmation email immediately.
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-2xl">
                    <p className="font-bold text-yellow-700">
                      Best Offers
                    </p>
                    <p className="text-gray-600 text-sm">
                      Apply coupon codes and save more on bookings.
                    </p>
                  </div>
                </div>

                <Link
                  to="/hotels"
                  className="block text-center mt-6 bg-gray-900 text-white py-3 rounded-full font-bold hover:bg-black"
                >
                  Browse More Hotels
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HotelDetailsPage;