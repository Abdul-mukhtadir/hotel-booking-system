import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-blue-900 text-white p-5 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">
          Admin Panel
        </h1>

        <div className="space-y-4">
          <Link
            to="/admin"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/hotels"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Hotels
          </Link>

          <Link
            to="/admin/rooms"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Rooms
          </Link>

          <Link
            to="/admin/bookings"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Bookings
          </Link>

          <Link
            to="/admin/users"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Users
          </Link>

          <Link
            to="/admin/reviews"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Reviews
          </Link>

          <Link
            to="/admin/offers"
            className="block bg-blue-800 hover:bg-blue-700 p-3 rounded-lg"
          >
            Offers
          </Link>

          <Link
            to="/"
            className="block bg-red-700 hover:bg-red-600 p-3 rounded-lg"
          >
            Back To Website
          </Link>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;