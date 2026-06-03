import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getHotels,
} from "../services/hotelService";

import {
  Link,
} from "react-router-dom";

function HotelsPage() {
  const [hotels, setHotels] =
    useState([]);

  const [city, setCity] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [amenity, setAmenity] =
    useState("");

  const [roomType, setRoomType] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [sort, setSort] =
    useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels =
    async () => {
      try {
        const data =
          await getHotels(
            city,
            search,
            amenity,
            roomType,
            minPrice,
            maxPrice,
            sort
          );

        setHotels(data);
      } catch (error) {
        console.log(error);
      }
    };

  const clearFilters = () => {
    setCity("");
    setSearch("");
    setAmenity("");
    setRoomType("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");

    setTimeout(() => {
      fetchHotels();
    }, 100);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <p className="uppercase tracking-widest text-blue-200 font-semibold">
              Discover Hotels
            </p>

            <h1 className="text-5xl font-extrabold mt-3">
              Find your next comfortable stay
            </h1>

            <p className="text-blue-100 mt-4 max-w-2xl">
              Search by location, room type, price range, amenities, and rating.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white p-6 rounded-3xl shadow-xl mb-10 border border-gray-100">
            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search City"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Hotel Name"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={amenity}
                onChange={(e) =>
                  setAmenity(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Amenities</option>
                <option value="WiFi">WiFi</option>
                <option value="Swimming Pool">Swimming Pool</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Parking">Parking</option>
                <option value="Gym">Gym</option>
              </select>

              <select
                value={roomType}
                onChange={(e) =>
                  setRoomType(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Room Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort By</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={fetchHotels}
                  className="bg-blue-600 text-white px-5 rounded-xl w-full hover:bg-blue-700 font-semibold"
                >
                  Search
                </button>

                <button
                  onClick={clearFilters}
                  className="bg-gray-800 text-white px-5 rounded-xl w-full hover:bg-gray-900 font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {hotels.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow">
              <p className="text-gray-600 text-lg">
                No hotels found
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 pb-16">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={hotel.images?.[0]}
                      alt={hotel.name}
                      className="h-64 w-full object-cover"
                    />

                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-yellow-600 shadow">
                      ⭐ {hotel.rating}
                    </span>
                  </div>

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

                    <Link
                      to={`/hotel/${hotel._id}`}
                      className="block text-center mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700"
                    >
                      View Details
                    </Link>
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

export default HotelsPage;