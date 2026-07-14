import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Feedback() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  if (!state?.booking) {
    return (
      <>
        <Navbar />

        <p style={{ padding: 30 }}>
          Choose a confirmed booking to leave feedback.
        </p>

        <Footer />
      </>
    );
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      await API.post("/feedback", {
        templeId:
          state.booking.templeId?._id || state.booking.templeId,
        bookingId: state.booking._id,
        rating: Number(rating),
        feedback,
      });

      navigate("/mybookings");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to submit feedback."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <form onSubmit={submit} style={styles.card}>
          <h2>Rate Your Darshan</h2>

          <p>{state.booking.templeId?.templeName}</p>

          {message && (
            <p style={styles.error}>
              {message}
            </p>
          )}

          <label>Rating</label>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} Star{value > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <label>Feedback</label>

          <textarea
            rows="5"
            maxLength="1000"
            required
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <button type="submit">
            Submit Feedback
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}

const styles = {
  page: {
    minHeight: "75vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "#f4f7f5",
  },

  card: {
    width: "min(420px, 100%)",
    display: "grid",
    gap: 10,
    padding: 28,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
  },

  error: {
    color: "#b42318",
    fontWeight: "bold",
  },
};

export default Feedback;