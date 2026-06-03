import {
  useContext,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  AuthContext,
} from "../context/AuthContext";

function ProfilePage() {
  const {
    user,
    setUser,
  } = useContext(AuthContext);

  const [name, setName] =
    useState(user?.name || "");

  const [phone, setPhone] =
    useState(user?.phone || "");

  const submitHandler = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name,
      phone,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    alert("Profile Updated");
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <p className="uppercase tracking-widest text-blue-200 font-semibold">
              Account Settings
            </p>

            <h1 className="text-5xl font-extrabold mt-3">
              My Profile
            </h1>

            <p className="text-blue-100 mt-4">
              Manage your personal information and booking profile.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-extrabold mx-auto">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <h2 className="text-2xl font-bold mt-4">
                {user?.name}
              </h2>

              <p className="text-gray-600 mt-1">
                {user?.email}
              </p>

              <span className="inline-block mt-4 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {user?.role || "user"}
              </span>
            </div>

            <form
              onSubmit={submitHandler}
              className="md:col-span-2 bg-white shadow-md rounded-3xl p-8"
            >
              <h2 className="text-3xl font-extrabold mb-6">
                Personal Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Name"
                    className="w-full border border-gray-300 p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="w-full border border-gray-300 p-4 rounded-2xl mt-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 p-4 rounded-2xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProfilePage;