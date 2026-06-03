import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import API from "../../services/api";

import {
  AuthContext,
} from "../../context/AuthContext";

import AdminLayout from "../../components/AdminLayout";

function AdminDashboard() {
  const { user } =
    useContext(AuthContext);

  const [stats, setStats] =
    useState({
      totalUsers: 0,
      totalHotels: 0,
      totalRooms: 0,
      totalBookings: 0,
      totalReviews: 0,
      activeBookings: 0,
      cancelledBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      recentBookings: [],
      recentReviews: [],
      monthlyStats: [],
      reviewStats: [],
      bookingStatusStats: [],
    });

  useEffect(() => {
    if (user?.token) {
      fetchStats();
    }
  }, [user]);

  const fetchStats =
    async () => {
      try {
        const response =
          await API.get(
            "/admin/stats",
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

        setStats(response.data);
      } catch (error) {
        console.log(
          "Dashboard Error",
          error
        );
      }
    };

  const colors = [
    "#2563eb",
    "#dc2626",
    "#16a34a",
    "#f97316",
    "#9333ea",
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-5xl font-bold mb-10">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-5 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold">
              {stats.totalUsers}
            </h2>
            <p className="text-gray-600 mt-2">
              Total Users
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold">
              {stats.totalHotels}
            </h2>
            <p className="text-gray-600 mt-2">
              Total Hotels
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold">
              {stats.totalRooms}
            </h2>
            <p className="text-gray-600 mt-2">
              Total Rooms
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold">
              {stats.totalBookings}
            </h2>
            <p className="text-gray-600 mt-2">
              Total Bookings
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-green-600">
              ₹{stats.totalRevenue}
            </h2>
            <p className="text-gray-600 mt-2">
              Revenue
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-blue-600">
              {stats.activeBookings}
            </h2>
            <p className="text-gray-600 mt-2">
              Active Bookings
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-red-600">
              {stats.cancelledBookings}
            </h2>
            <p className="text-gray-600 mt-2">
              Cancelled
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-purple-600">
              {stats.completedBookings}
            </h2>
            <p className="text-gray-600 mt-2">
              Completed
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-orange-600">
              {stats.totalReviews}
            </h2>
            <p className="text-gray-600 mt-2">
              Reviews
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-teal-600">
              {stats.occupancyRate}%
            </h2>
            <p className="text-gray-600 mt-2">
              Occupancy Rate
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Monthly Revenue Report
            </h2>

            <div className="h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    stats.monthlyStats
                  }
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="revenue"
                    fill="#16a34a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Booking Trends
            </h2>

            <div className="h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={
                    stats.monthlyStats
                  }
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Booking Status Report
            </h2>

            <div className="h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={
                      stats.bookingStatusStats
                    }
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.bookingStatusStats.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            colors[
                              index %
                                colors.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Review Analytics
            </h2>

            <div className="h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    stats.reviewStats
                  }
                >
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#f97316"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Recent Bookings
            </h2>

            {stats.recentBookings.length ===
            0 ? (
              <p className="text-gray-600">
                No recent bookings
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentBookings.map(
                  (booking) => (
                    <div
                      key={booking._id}
                      className="border-b pb-3"
                    >
                      <p className="font-bold">
                        {
                          booking.hotel
                            ?.name
                        }
                      </p>

                      <p className="text-sm text-gray-600">
                        User:{" "}
                        {
                          booking.user
                            ?.name
                        }
                      </p>

                      <p className="text-sm text-gray-600">
                        Room:{" "}
                        {
                          booking.room
                            ?.roomType
                        }{" "}
                        -{" "}
                        {
                          booking.room
                            ?.roomNumber
                        }
                      </p>

                      <p className="text-sm text-blue-600">
                        ₹
                        {
                          booking.totalPrice
                        }{" "}
                        |{" "}
                        {
                          booking.bookingStatus
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Recent Reviews
            </h2>

            {stats.recentReviews.length ===
            0 ? (
              <p className="text-gray-600">
                No recent reviews
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentReviews.map(
                  (review) => (
                    <div
                      key={review._id}
                      className="border-b pb-3"
                    >
                      <p className="font-bold">
                        {
                          review.hotel
                            ?.name
                        }
                      </p>

                      <p className="text-sm text-gray-600">
                        User:{" "}
                        {
                          review.user
                            ?.name
                        }
                      </p>

                      <p className="text-sm">
                        ⭐ {review.rating}
                      </p>

                      <p className="text-sm text-gray-600">
                        {
                          review.comment
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;