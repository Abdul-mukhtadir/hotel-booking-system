import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-sky-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-widest text-blue-100 font-semibold mb-4">
              Premium Hotel Booking
            </p>

            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Find your perfect stay with comfort and luxury
            </h1>

            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              Search hotels, compare rooms, apply offers, book securely,
              and manage your reservations in one place.
            </p>

            <div className="flex gap-4">
              <Link
                to="/hotels"
                className="bg-white text-blue-700 px-7 py-4 rounded-full font-bold hover:bg-gray-100"
              >
                Explore Hotels
              </Link>

              <Link
                to="/register"
                className="border border-white px-7 py-4 rounded-full font-bold hover:bg-white hover:text-blue-700"
              >
                Get Started
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <h3 className="text-3xl font-bold">100+</h3>
                <p className="text-blue-100">Rooms</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-blue-100">Support</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">Secure</h3>
                <p className="text-blue-100">Payments</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
              alt="Luxury Hotel"
              className="rounded-2xl h-[480px] w-full object-cover"
            />

            <div className="bg-white text-gray-900 rounded-2xl p-5 -mt-20 mx-6 relative shadow-xl">
              <h2 className="text-2xl font-bold">
                Luxury stays at best prices
              </h2>

              <p className="text-gray-600 mt-2">
                Book rooms with offers, reviews, invoices, and secure payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;