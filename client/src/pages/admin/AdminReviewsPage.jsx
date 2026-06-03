import {
  useEffect,
  useState,
  useContext,
} from "react";

import API from "../../services/api";

import {
  AuthContext,
} from "../../context/AuthContext";

import AdminLayout from "../../components/AdminLayout";

function AdminReviewsPage() {
  const { user } =
    useContext(AuthContext);

  const [reviews, setReviews] =
    useState([]);

  const [replyText, setReplyText] =
    useState({});

  useEffect(() => {
    if (user?.token) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await API.get(
        "/reviews/admin/all",
        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );

      setReviews(response.data);
    } catch (error) {
      console.log(
        "Review Fetch Error:",
        error
      );
    }
  };

  const updateReviewStatus =
    async (id, status) => {
      try {
        await API.put(
          `/reviews/admin/${id}`,
          { status },
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        alert(
          "Review status updated"
        );

        fetchReviews();
      } catch (error) {
        console.log(
          "Review Update Error:",
          error
        );
      }
    };

  const submitReply =
    async (id) => {
      try {
        await API.put(
          `/reviews/admin/${id}`,
          {
            adminReply:
              replyText[id] || "",
          },
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        alert(
          "Reply saved"
        );

        setReplyText({
          ...replyText,
          [id]: "",
        });

        fetchReviews();
      } catch (error) {
        console.log(
          "Reply Error:",
          error
        );
      }
    };

  const deleteReview =
    async (id) => {
      try {
        await API.delete(
          `/reviews/admin/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`,
            },
          }
        );

        alert(
          "Review deleted"
        );

        fetchReviews();
      } catch (error) {
        console.log(
          "Delete Review Error:",
          error
        );
      }
    };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-5xl font-bold mb-10">
          Review Moderation
        </h1>

        {reviews.length === 0 ? (
          <p>No reviews found</p>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h2 className="text-2xl font-bold">
                  {review.hotel?.name}
                </h2>

                <p className="mt-2">
                  Hotel City:{" "}
                  {review.hotel?.city}
                </p>

                <p className="mt-2">
                  User:{" "}
                  {review.user?.name} (
                  {review.user?.email})
                </p>

                <p className="mt-2">
                  Rating: ⭐ {review.rating}
                </p>

                <p className="mt-2">
                  Comment: {review.comment}
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={
                      review.status === "Approved"
                        ? "font-bold text-green-600"
                        : review.status === "Rejected"
                        ? "font-bold text-red-600"
                        : "font-bold text-yellow-600"
                    }
                  >
                    {review.status}
                  </span>
                </p>

                {review.adminReply && (
                  <p className="mt-3 bg-gray-100 p-3 rounded-lg">
                    <span className="font-bold">
                      Admin Reply:
                    </span>{" "}
                    {review.adminReply}
                  </p>
                )}

                <textarea
                  placeholder="Write admin reply"
                  value={
                    replyText[review._id] || ""
                  }
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [review._id]:
                        e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg w-full mt-4"
                  rows="3"
                />

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() =>
                      updateReviewStatus(
                        review._id,
                        "Approved"
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateReviewStatus(
                        review._id,
                        "Rejected"
                      )
                    }
                    className="bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      submitReply(review._id)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save Reply
                  </button>

                  <button
                    onClick={() =>
                      deleteReview(review._id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminReviewsPage;