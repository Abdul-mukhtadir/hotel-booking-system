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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

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
                value={formData.name}
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="10 Digit Phone Number"
                value={formData.phone}
                maxLength="10"
                className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const onlyNumbers =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setFormData({
                    ...formData,
                    phone: onlyNumbers,
                  });
                }}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password Min 6 Characters"
                value={formData.password}
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