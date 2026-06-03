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

function AdminOffersPage() {
  const { user } =
    useContext(AuthContext);

  const [offers, setOffers] =
    useState([]);

  const [editOfferId, setEditOfferId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      code: "",
      discountPercentage: "",
      validFrom: "",
      validTo: "",
      isActive: true,
    });

  useEffect(() => {
    if (user?.token) {
      fetchOffers();
    }
  }, [user]);

  const fetchOffers =
    async () => {
      try {
        const response =
          await API.get(
            "/offers/admin/all",
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

        setOffers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleChange =
    (e) => {
      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setFormData({
        ...formData,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      });
    };

  const resetForm = () => {
    setEditOfferId(null);

    setFormData({
      title: "",
      code: "",
      discountPercentage: "",
      validFrom: "",
      validTo: "",
      isActive: true,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const offerData = {
        title: formData.title,
        code:
          formData.code.toUpperCase(),
        discountPercentage:
          Number(
            formData.discountPercentage
          ),
        validFrom:
          formData.validFrom,
        validTo:
          formData.validTo,
        isActive:
          formData.isActive,
      };

      try {
        if (editOfferId) {
          await API.put(
            `/offers/${editOfferId}`,
            offerData,
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

          alert(
            "Offer Updated Successfully"
          );
        } else {
          await API.post(
            "/offers",
            offerData,
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

          alert(
            "Offer Created Successfully"
          );
        }

        resetForm();
        fetchOffers();
      } catch (error) {
        console.log(error);
        alert(
          "Offer Operation Failed"
        );
      }
    };

  const editOffer =
    (offer) => {
      setEditOfferId(
        offer._id
      );

      setFormData({
        title:
          offer.title,
        code:
          offer.code,
        discountPercentage:
          offer.discountPercentage,
        validFrom:
          offer.validFrom?.split(
            "T"
          )[0],
        validTo:
          offer.validTo?.split(
            "T"
          )[0],
        isActive:
          offer.isActive,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  const deleteOffer =
    async (id) => {
      try {
        await API.delete(
          `/offers/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        fetchOffers();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-5xl font-bold mb-10">
          Special Offers
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-10"
        >
          <h2 className="text-2xl font-bold mb-4">
            {editOfferId
              ? "Edit Offer"
              : "Create Offer"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Offer Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="code"
              placeholder="Coupon Code e.g. SUMMER20"
              value={formData.code}
              onChange={handleChange}
              className="border p-3 rounded-lg uppercase"
              required
            />

            <input
              type="number"
              name="discountPercentage"
              placeholder="Discount %"
              value={
                formData.discountPercentage
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="date"
              name="validFrom"
              value={
                formData.validFrom
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="date"
              name="validTo"
              value={formData.validTo}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <label className="flex items-center gap-3 border p-3 rounded-lg">
              <input
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={handleChange}
              />
              Active Offer
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {editOfferId
                ? "Update Offer"
                : "Create Offer"}
            </button>

            {editOfferId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-bold">
                {offer.title}
              </h2>

              <p className="mt-2">
                Code:{" "}
                <span className="font-bold">
                  {offer.code}
                </span>
              </p>

              <p className="mt-2">
                Discount:{" "}
                {
                  offer.discountPercentage
                }
                %
              </p>

              <p className="mt-2">
                Valid:{" "}
                {new Date(
                  offer.validFrom
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  offer.validTo
                ).toLocaleDateString()}
              </p>

              <p className="mt-2">
                Status:{" "}
                {offer.isActive
                  ? "Active"
                  : "Inactive"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    editOffer(offer)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteOffer(
                      offer._id
                    )
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOffersPage;