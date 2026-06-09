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

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        phone: onlyNumbers,
      });

      setErrors({
        ...errors,
        phone: "",
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const getErrorMessage = (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed";

    if (typeof message === "string") {
      return message;
    }

    return "Registration failed";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

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
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
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
            noValidate
          >
            <p className="uppercase tracking-widest text-blue-600 font-semibold">
              Create Account
            </p>

            <h1 className="text-4xl font-extrabold mt-3 mb-8">
              Start your booking journey
            </h1>

            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10 Digit Phone Number"
                  value={formData.phone}
                  maxLength="10"
                  className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password Min 6 Characters"
                  value={formData.password}
                  className="w-full border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
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
