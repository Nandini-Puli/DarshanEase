import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import API from "../services/api";

function Payment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(
    location.state?.booking || null
  );

  const [method, setMethod] = useState("UPI");

  const [loading, setLoading] = useState(
    !location.state?.booking
  );

  const [paying, setPaying] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (booking) return;

    const fetchBooking = async () => {
      try {
        const res = await API.get(
          `/bookings/${bookingId}`
        );

        setBooking(res.data?.booking || res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Booking not found."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [booking, bookingId]);

  const makePayment = async () => {
    try {
      setPaying(true);
      setError("");

      const res = await API.post("/payments", {
        bookingId: booking._id,
        paymentMethod: method,
      });

      const confirmedBooking = res.data?.booking || booking;

      navigate("/booking-confirmation", {
        replace: true,
        state: {
          booking: confirmedBooking,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <section style={styles.card}>
          {booking ? (
            <>
              <h2>Payment</h2>

              {error && (
                <p style={styles.error}>
                  {error}
                </p>
              )}

              <p>
                <b>Temple :</b>{" "}
                {booking.templeId?.templeName}
              </p>

              <p>
                <b>Darshan :</b>{" "}
                {booking.slotId?.darshanName}
              </p>

              <p>
                <b>Number of Persons :</b>{" "}
                {booking.numberOfPersons}
              </p>

              <p>
                <b>Total Amount :</b> ₹
                {booking.totalPrice}
              </p>

              <label htmlFor="method">
                Payment Method
              </label>

              <select
                id="method"
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value)
                }
                style={styles.select}
              >
                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

                <option value="Razorpay">
                  Razorpay (Placeholder)
                </option>
              </select>

              <button
                onClick={makePayment}
                disabled={paying}
                style={styles.button}
              >
                {paying
                  ? "Processing..."
                  : "Pay Now"}
              </button>
            </>
          ) : (
            <p style={styles.error}>
              {error}
            </p>
          )}
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
    width: "min(450px,100%)",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "10px",
    margin: "10px 0 20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#008080",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  error: {
    color: "#b42318",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default Payment;