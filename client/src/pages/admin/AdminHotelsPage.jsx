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

function AdminHotelsPage() {

  const { user } =
    useContext(AuthContext);

  const [hotels, setHotels] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      city: "",
      address: "",
      description: "",
      image: "",
    });

  useEffect(() => {
    fetchHotels();
  }, []);

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

  const handleChange = (
    e
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await API.post(
          "/hotels",
          {
            name:
              formData.name,

            city:
              formData.city,

            address:
              formData.address,

            description:
              formData.description,

            images: [
              formData.image,
            ],

            amenities: [
              "WiFi",
              "Pool",
              "Restaurant",
            ],
          },
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        alert(
          "Hotel Added Successfully"
        );

        setFormData({
          name: "",
          city: "",
          address: "",
          description:
            "",
          image: "",
        });

        fetchHotels();

      } catch (err) {
        console.log(err);
      }
    };

  const deleteHotel =
    async (id) => {

      try {

        await API.delete(
          `/hotels/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        fetchHotels();

      } catch (err) {
        console.log(err);
      }
    };

  return (

    <AdminLayout>

      <div>

        <h1 className="text-5xl font-bold mb-10">
          Admin Hotels
        </h1>

        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-white p-6 rounded-xl shadow-md mb-10"
        >

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={
                formData.image
              }
              onChange={
                handleChange
              }
              className="border p-3 rounded-lg"
              required
            />

          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows="4"
            className="border p-3 rounded-lg w-full mt-4"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4"
          >
            Add Hotel
          </button>

        </form>

        {/* Hotel Cards */}

        <div className="grid md:grid-cols-3 gap-6">

          {hotels.map(
            (hotel) => (

              <div
                key={hotel._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >

                <img
                  src={
                    hotel.images?.[0]
                  }
                  alt={
                    hotel.name
                  }
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <h2 className="text-2xl font-bold">
                    {
                      hotel.name
                    }
                  </h2>

                  <p className="mt-2">
                    {hotel.city}
                  </p>

                  <button
                    onClick={() =>
                      deleteHotel(
                        hotel._id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4"
                  >
                    Delete
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminHotelsPage;