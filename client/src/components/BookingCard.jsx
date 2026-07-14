import React from "react";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

function BookingCard({
  booking,
  onViewTicket,
  onCancel,
}) {
  if (!booking) return null;

  const statusColor = {
    Confirmed: "#28a745",
    Pending: "#ffc107",
    Cancelled: "#dc3545",
  };

  const paymentColor = {
    Paid: "#28a745",
    Pending: "#ffc107",
    Failed: "#dc3545",
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>
        {booking.templeName}
      </h2>

      <p>
        <strong>Booking ID :</strong>{" "}
        {booking._id || booking.bookingId}
      </p>

      <p>
        <strong>Darshan :</strong>{" "}
        {booking.darshanName}
      </p>

      <p>
        <strong>Date :</strong>{" "}
        {booking.date
          ? formatDate(booking.date)
          : "N/A"}
      </p>

      <p>
        <strong>Time :</strong>{" "}
        {booking.time}
      </p>

      <p>
        <strong>Persons :</strong>{" "}
        {booking.numberOfPersons}
      </p>

      <p>
        <strong>Total Price :</strong>{" "}
        {formatCurrency(booking.totalPrice)}
      </p>

      <p>
        <strong>Payment :</strong>{" "}
        <span
          style={{
            color:
              paymentColor[
                booking.paymentStatus
              ] || "#000",
            fontWeight: "bold",
          }}
        >
          {booking.paymentStatus ||
            "Pending"}
        </span>
      </p>

      <p>
        <strong>Status :</strong>{" "}
        <span
          style={{
            color:
              statusColor[
                booking.status
              ] || "#000",
            fontWeight: "bold",
          }}
        >
          {booking.status}
        </span>
      </p>

      <div style={styles.buttonContainer}>
        <button
          style={styles.ticketButton}
          onClick={() =>
            onViewTicket &&
            onViewTicket(booking)
          }
        >
          View Ticket
        </button>

        <button
          style={styles.cancelButton}
          onClick={() =>
            onCancel &&
            onCancel(booking._id)
          }
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "340px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px",
    boxShadow:
      "0 4px 10px rgba(0,0,0,0.15)",
    borderTop: "6px solid #008080",
  },

  heading: {
    color: "#008080",
    textAlign: "center",
    marginBottom: "20px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  ticketButton: {
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default BookingCard;