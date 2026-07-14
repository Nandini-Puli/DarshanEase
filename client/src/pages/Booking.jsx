import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import API from "../services/api";

function Booking() {
  const { templeId, slotId } = useParams();
  const navigate = useNavigate();

  const [darshan, setDarshan] = useState(null);
  const [persons, setPersons] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchDarshan();
  }, [slotId, templeId]);

  const fetchDarshan = async () => {
    try {
      const res = await API.get(`/darshans/${slotId}`);

      const slot = res.data?.darshan || res.data;

      if (
        !slot ||
        String(slot.templeId?._id || slot.templeId) !== templeId
      ) {
        throw new Error("The selected darshan is invalid");
      }

      setDarshan(slot);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load darshan details."
      );
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async () => {
    if (!Number.isInteger(persons) || persons < 1) {
      setError("Select at least one devotee.");
      return;
    }

    if (persons > darshan.availableSeats) {
      setError("Not enough seats are available.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await API.post("/bookings", {
        templeId,
        slotId,
        numberOfPersons: persons,
      });

      navigate(`/payment/${res.data.booking._id}`, {
        state: {
          booking: res.data.booking,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!darshan) {
    return (
      <>
        <Navbar />

        <main style={styles.page}>
          <p style={styles.error}>
            {error || "Darshan not found."}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  const totalAmount = persons * darshan.price;

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <section style={styles.card}>
          <h2>Book Darshan Ticket</h2>

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <div style={styles.info}>
            <p>
              <b>Temple :</b>{" "}
              {darshan.templeId?.templeName}
            </p>

            <p>
              <b>Darshan :</b>{" "}
              {darshan.darshanName}
            </p>

            <p>
              <b>Date :</b>{" "}
              {new Date(
                darshan.date
              ).toLocaleDateString()}
            </p>

            <p>
              <b>Time :</b>{" "}
              {darshan.startTime} - {darshan.endTime}
            </p>

            <p>
              <b>Available Seats :</b>{" "}
              {darshan.availableSeats}
            </p>

            <p>
              <b>Price Per Ticket :</b>
              ₹{darshan.price}
            </p>
          </div>

          <label htmlFor="persons">
            Number of Devotees
          </label>

          <input
            id="persons"
            type="number"
            min="1"
            max={darshan.availableSeats}
            value={persons}
            onChange={(e) =>
              setPersons(Number(e.target.value))
            }
            style={styles.input}
          />

          <h2 style={styles.total}>
            Total Amount : ₹
            {Number.isFinite(totalAmount)
              ? totalAmount
              : 0}
          </h2>

          <div style={styles.actions}>
            <button
              style={styles.secondary}
              onClick={() => navigate(-1)}
            >
              Back
            </button>

            <button
              onClick={submitBooking}
              disabled={
                submitting ||
                !darshan.availableSeats
              }
            >
              {submitting
                ? "Creating..."
                : "Confirm Booking"}
            </button>
          </div>
        </section>
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
    padding: "24px",
    background: "#f4f7f5",
  },

  card: {
    width: "min(520px,100%)",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },

  info: {
    lineHeight: "1.8",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0 20px",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },

  total: {
    color: "#087c62",
    textAlign: "center",
    marginBottom: "20px",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },

  secondary: {
    background: "#667085",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  error: {
    color: "#b42318",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default Booking;