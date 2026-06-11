import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HotelsPage from "../pages/HotelsPage";
import HotelDetailsPage from "../pages/HotelDetailsPage";
import BookingPage from "../pages/BookingPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import ProfilePage from "../pages/ProfilePage";
import FavoritesPage from "../pages/FavoritesPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminHotelsPage from "../pages/admin/AdminHotelsPage";
import AdminRoomsPage from "../pages/admin/AdminRoomsPage";
import AdminBookingsPage from "../pages/admin/AdminBookingsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";
import AdminOffersPage from "../pages/admin/AdminOffersPage";

function AppRoutes() {
  const { user } =
    useContext(AuthContext);

  const AuthPage = ({
    children,
  }) => {
    return user ? (
      <Navigate
        to="/"
        replace
      />
    ) : (
      children
    );
  };

  const ProtectedPage = ({
    children,
  }) => {
    return user ? (
      children
    ) : (
      <Navigate
        to="/login"
        replace
      />
    );
  };

  const AdminPage = ({
    children,
  }) => {
    return user?.role ===
      "admin" ? (
      children
    ) : (
      <Navigate
        to="/"
        replace
      />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={
            <AuthPage>
              <LoginPage />
            </AuthPage>
          }
        />

        <Route
          path="/register"
          element={
            <AuthPage>
              <RegisterPage />
            </AuthPage>
          }
        />

        <Route
          path="/hotels"
          element={<HotelsPage />}
        />

        <Route
          path="/hotel/:id"
          element={
            <HotelDetailsPage />
          }
        />

        <Route
          path="/booking/:id"
          element={
            <ProtectedPage>
              <BookingPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/mybookings"
          element={
            <ProtectedPage>
              <MyBookingsPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedPage>
              <ProfilePage />
            </ProtectedPage>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedPage>
              <FavoritesPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminPage>
              <AdminDashboard />
            </AdminPage>
          }
        />

        <Route
          path="/admin/hotels"
          element={
            <AdminPage>
              <AdminHotelsPage />
            </AdminPage>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <AdminPage>
              <AdminRoomsPage />
            </AdminPage>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminPage>
              <AdminBookingsPage />
            </AdminPage>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminPage>
              <AdminUsersPage />
            </AdminPage>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <AdminPage>
              <AdminReviewsPage />
            </AdminPage>
          }
        />

        <Route
          path="/admin/offers"
          element={
            <AdminPage>
              <AdminOffersPage />
            </AdminPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;