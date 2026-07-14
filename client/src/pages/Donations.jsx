import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function Donations() {
  const location = useLocation();
  const message = location.state?.message;

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/donations/user")
      .then(({ data }) => {
        setDonations(
          Array.isArray(data?.donations) ? data.donations : []
        );
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Unable to fetch donations."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <h2>My Donations</h2>

        {message && (
          <p style={styles.success}>
            {message}
          </p>
        )}

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {!donations.length && !error ? (
          <p>No donations yet.</p>
        ) : (
          donations.map((item) => (
            <article key={item._id} style={styles.card}>
              <h2>{item.templeId?.templeName}</h2>

              <p>
                <strong>Amount:</strong> Rs. {item.amount}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {item.paymentMethod}
              </p>

              <p>
                <strong>Status:</strong> {item.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.donatedAt).toLocaleDateString()}
              </p>

              <small>
                <strong>Transaction ID:</strong>{" "}
                {item.transactionId}
              </small>
            </article>
          ))
        )}
      </main>

      <Footer />
    </>
  );
}

const styles = {
  page: {
    minHeight: "75vh",
    padding: "32px 8%",
    background: "#f4f7f5",
  },

  card: {
    margin: "12px 0",
    padding: 18,
    borderRadius: 10,
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  success: {
    color: "#087c62",
    fontWeight: "bold",
    marginBottom: 15,
  },

  error: {
    color: "#b42318",
    fontWeight: "bold",
    marginBottom: 15,
  },
};

export default Donations;