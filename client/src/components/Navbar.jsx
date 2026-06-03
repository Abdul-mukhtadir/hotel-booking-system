import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

function Navbar() {
  const { user, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight"
        >
          Stay<span className="text-gray-900">Ease</span>
        </Link>

        <div className="flex items-center gap-5 text-gray-700 font-medium">
          <Link className="hover:text-blue-600" to="/">
            Home
          </Link>

          <Link className="hover:text-blue-600" to="/hotels">
            Hotels
          </Link>

          {user ? (
            <>
              <Link className="hover:text-blue-600" to="/mybookings">
                My Bookings
              </Link>

              <Link className="hover:text-blue-600" to="/favorites">
                Favorites
              </Link>

              <Link className="hover:text-blue-600" to="/profile">
                Profile
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="hover:text-blue-600" to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;