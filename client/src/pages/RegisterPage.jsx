import {
  useState,
  useContext,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { registerUser } from "../services/authService";

import { AuthContext } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData);

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      setUser(data);

      toast.success("Registration successful");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-sky-500 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
              alt="Hotel Lobby"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="text-4xl font-extrabold">
                Join StayEase
              </h2>

              <p className="mt-3 text-blue-100">
                Save favorites, book rooms, apply offers, and manage stays.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-12"
          >
            <p className="uppercase tracking-widest text-blue-600 font-semibold">
              Create Account
            </p>

            <h1 className="text-4xl font-extrabold mt-3 mb-8">
              Start your booking journey
            </h1>

            <div className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700"
              >
                Register
              </button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default RegisterPage;