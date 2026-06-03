import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/hotels" element={<HotelsPage />} />

        <Route path="/hotel/:id" element={<HotelDetailsPage />} />

        <Route path="/booking/:id" element={<BookingPage />} />

        <Route path="/mybookings" element={<MyBookingsPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/hotels" element={<AdminHotelsPage />} />

        <Route path="/admin/rooms" element={<AdminRoomsPage />} />

        <Route path="/admin/bookings" element={<AdminBookingsPage />} />

        <Route path="/admin/users" element={<AdminUsersPage />} />

        <Route path="/admin/reviews" element={<AdminReviewsPage />} />

        <Route path="/admin/offers" element={<AdminOffersPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;