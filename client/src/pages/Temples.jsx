import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
  try {
    setLoading(true);

    const res = await API.get("/temples");

    console.log("Temple API Response:", res.data);

    let templeList = [];

    if (Array.isArray(res.data)) {
      templeList = res.data;
    } else if (Array.isArray(res.data.temples)) {
      templeList = res.data.temples;
    } else if (Array.isArray(res.data.data)) {
      templeList = res.data.data;
    }

    setTemples(templeList);
  } catch (error) {
    console.log(error);
    alert("Failed to load temples");
    setTemples([]);
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div style={styles.topBar}>
        <h2 style={styles.logo}>DarshanEase</h2>

        <div style={styles.menu}>
          <Link to="/" style={styles.menuLink}>
            Home
          </Link>

          <Link to="/temples" style={styles.menuLink}>
            Temples
          </Link>

          <Link to="/mybookings" style={styles.menuLink}>
            My Bookings
          </Link>

          <Link to="/login" style={styles.menuLink}>
            Logout
          </Link>
        </div>
      </div>

      <div style={styles.page}>
        <h1 style={styles.heading}>
          Available Temples
        </h1>

        {temples.length === 0 ? (
          <h2>No Temples Available</h2>
        ) : (
          <div style={styles.container}>
            {Array.isArray(temples) &&
             temples.map((temple) => (
              <div
                key={temple._id}
                style={styles.card}
              >
                <img
                src={`http://localhost:5000${temple.image}`}
                alt={temple.templeName}
                style={styles.image}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x220?text=Temple";
                }}
                />

                <h2 style={styles.name}>
                  {temple.templeName}
                </h2>

                <h3>Temple Timings</h3>

                <p>
                  <strong>Open:</strong>{" "}
                  {temple.openTime}
                </p>

                <p>
                  <strong>Close:</strong>{" "}
                  {temple.closeTime}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {temple.location}
                </p>

                <p style={styles.description}>
                  <strong>Description:</strong>{" "}
                  {temple.description.length > 100
                  ? temple.description.substring(0, 100) + "..."
                  : temple.description}
                </p>

                <Link
                  to={`/temples/${temple._id}`}
                >
                  <button style={styles.button}>
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  topBar: {
    backgroundColor: "#008080",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
  },

  logo: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "bold",
  },

  menu: {
    display: "flex",
    gap: "30px",
  },

  menuLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },

  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "40px",
  },

  heading: {
    textAlign: "center",
    fontSize: "35px",
    marginBottom: "35px",
    color: "#008080",
  },

  container: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(330px,1fr))",
    gap: "30px",
  },

  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,.15)",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  name: {
    color: "#008080",
    textAlign: "center",
    marginTop: "15px",
  },

  description: {
    lineHeight: "24px",
    textAlign: "justify",
  },

  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    border: "none",
    background: "#008080",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Temples;