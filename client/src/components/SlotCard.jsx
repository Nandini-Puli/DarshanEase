import React from "react";

function SlotCard({ slot, onBook }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        {slot.templeName}
      </h2>

      <h3 style={styles.darshan}>
        {slot.darshanName}
      </h3>

      <p>
        <strong>Date :</strong> {slot.date}
      </p>

      <p>
        <strong>Time :</strong> {slot.time}
      </p>

      <p>
        <strong>Price :</strong> ₹{slot.price}
      </p>

      <p>
        <strong>Available Tickets :</strong>{" "}
        {slot.availableTickets}
      </p>

      <p>
        <strong>Status :</strong>{" "}
        {slot.availableTickets > 0
          ? "Available"
          : "Sold Out"}
      </p>

      <button
        style={
          slot.availableTickets > 0
            ? styles.button
            : styles.disabledButton
        }
        disabled={slot.availableTickets === 0}
        onClick={() => onBook(slot)}
      >
        {slot.availableTickets > 0
          ? "Book Now"
          : "Sold Out"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    width: "320px",
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    textAlign: "center",
    margin: "15px",
  },

  title: {
    color: "#008080",
    marginBottom: "8px",
  },

  darshan: {
    color: "#ff5722",
    marginBottom: "15px",
  },

  button: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    background: "#008080",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  disabledButton: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    background: "#999",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontWeight: "bold",
  },
};

export default SlotCard;