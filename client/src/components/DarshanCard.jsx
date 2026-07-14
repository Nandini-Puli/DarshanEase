import { Link } from "react-router-dom";

function DarshanCard({ darshan, templeId }) {
  return (
    <div style={styles.card}>
      <h3>{darshan.name}</h3>

      <p>
        <strong>Date:</strong> {darshan.date}
      </p>

      <p>
        <strong>Time:</strong> {darshan.time}
      </p>

      <p>
        <strong>Normal Price:</strong> ₹{darshan.normalPrice}
      </p>

      <p>
        <strong>VIP Price:</strong> ₹{darshan.vipPrice}
      </p>

      <p>{darshan.description}</p>

      <Link
        to={`/payment/${templeId}`}
        state={{
          templeId,
          darshan,
        }}
      >
        <button style={styles.button}>
          Book Now
        </button>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    width: "300px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    margin: "15px",
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#008080",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DarshanCard;