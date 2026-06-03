import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { getFavorites, removeFavorite } from "../services/userService";

function FavoritesPage() {
  const { user } = useContext(AuthContext);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.token) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites(user.token);
      setFavorites(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (hotelId) => {
    try {
      await removeFavorite(hotelId, user.token);
      fetchFavorites();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <p className="uppercase tracking-widest text-blue-200 font-semibold">
              Saved Hotels
            </p>

            <h1 className="text-5xl font-extrabold mt-3">
              My Favorites
            </h1>

            <p className="text-blue-100 mt-4">
              Quickly access hotels you liked and book anytime.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md p-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                No favorite hotels yet
              </h2>

              <p className="text-gray-600 mt-3">
                Explore hotels and save your preferred stays.
              </p>

              <Link
                to="/hotels"
                className="inline-block mt-6 bg-blue-600 text-white px-7 py-3 rounded-full font-bold hover:bg-blue-700"
              >
                Explore Hotels
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {favorites.map((hotel) => (
                <div
                  key={hotel._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300"
                >
                  <img
                    src={hotel.images?.[0]}
                    alt={hotel.name}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      {hotel.name}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-1">
                      📍 {hotel.city}
                    </p>

                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {hotel.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {hotel.amenities?.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link
                        to={`/hotel/${hotel._id}`}
                        className="bg-blue-600 text-white px-5 py-3 rounded-full font-bold hover:bg-blue-700"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => handleRemove(hotel._id)}
                        className="bg-red-600 text-white px-5 py-3 rounded-full font-bold hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default FavoritesPage;