import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function BookingConfirmation() {
  const booking = useLocation().state?.booking;

  if (!booking) {
    return (
      <>
        <Navbar />
        <main style={styles.page}>
          <section style={styles.card}>
            <h2 style={styles.title}>No confirmed booking was found.</h2>
            <Link to="/mybookings" style={styles.link}>
              View my bookings
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <section style={styles.card}>
          <h2 style={styles.title}>Booking Successful</h2>
          <p>Your payment was successful and your ticket is ready.</p>
          <p>
            <b>Booking ID:</b> {booking.ticketNumber || booking._id}
          </p>
          <p>
            <b>Temple Name:</b> {booking.templeId?.templeName}
          </p>
          <p>
            <b>Darshan Date:</b>{" "}
            {booking.slotId?.date
              ? new Date(booking.slotId.date).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <b>Time Slot:</b> {booking.slotId?.startTime} - {booking.slotId?.endTime}
          </p>
          <p>
            <b>Number of Persons:</b> {booking.numberOfPersons}
          </p>
          <p>
            <b>Total Amount:</b> Rs. {booking.totalPrice}
          </p>

          <div style={styles.actions}>
            <Link to="/mybookings" style={styles.primaryLink}>
              Go to My Bookings
            </Link>
            <Link to="/" style={styles.secondaryLink}>
              Back to Home
            </Link>
          </div>
        </section>
      </main>
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
    width: "min(520px, 100%)",
    padding: 32,
    borderRadius: 12,
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 4px 18px #0002",
  },

  title: {
    color: "#087c62",
    marginBottom: 8,
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  },

  link: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 6,
    background: "#087c62",
    color: "white",
    textDecoration: "none",
  },

  primaryLink: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 6,
    background: "#087c62",
    color: "white",
    textDecoration: "none",
  },

  secondaryLink: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 6,
    background: "#667085",
    color: "white",
    textDecoration: "none",
  },
};

export default BookingConfirmation;
