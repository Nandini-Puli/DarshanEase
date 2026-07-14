import React from "react";
import { Link } from "react-router-dom";

function TempleCard({ temple }) {
  return (
    <div style={styles.card}>
      <img
        src={temple.image}
        alt={temple.templeName}
        style={styles.image}
      />

      <h2 style={styles.title}>
        {temple.templeName}
      </h2>

      <p>
        <strong>Location :</strong> {temple.location}
      </p>

      <p>
        <strong>Opening :</strong> {temple.openTime}
      </p>

      <p>
        <strong>Closing :</strong> {temple.closeTime}
      </p>

      <p>
        <strong>Organizer :</strong> {temple.organizer}
      </p>

      <p style={styles.description}>
        {temple.description}
      </p>

      <Link to={`/temples/${temple._id}`}>
        <button style={styles.button}>
          View Details
        </button>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    width: "330px",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "20px",
    textAlign: "center",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  title: {
    marginTop: "15px",
    color: "#008080",
  },

  description: {
    marginTop: "12px",
    color: "#555",
    lineHeight: "22px",
    minHeight: "60px",
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#008080",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
};

export default TempleCard;