import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import TempleCard from "../components/TempleCard";
import API from "../services/api";

import Herotemple from "../assets/images/hero/Herotemple.webp";
import herologo from "../assets/images/hero/herologo.webp";
import Herotemple2 from "../assets/images/hero/Herotemple2.webp";
import templeBackground from "../assets/images/backgrounds/temple-background.jpg";

function Home() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchTemples = async () => {
    try {
      setLoading(true);

      const res = await API.get("/temples");

      console.log("Temple API Response:", res.data);

      let templeData = [];

      if (Array.isArray(res.data)) {
        templeData = res.data;
      } else if (Array.isArray(res.data.temples)) {
        templeData = res.data.temples;
      } else if (Array.isArray(res.data.data)) {
        templeData = res.data.data;
      }

      setTemples(templeData);
    } catch (err) {
      console.error("Error fetching temples:", err);
      setTemples([]);
    } finally {
      setLoading(false);
    }
  };

  fetchTemples();
}, []);

  if (loading) {
    return <Loader />;
  }

  const styles = {
    container: {
      width: "98%",
      margin: "20px auto",
      backgroundColor: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },

    topHeader: {
      backgroundColor: "orangered",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "12px",
    },

    sideImg: {
      width: "120px",
      height: "70px",
      objectFit: "cover",
    },

    logoSection: {
      textAlign: "center",
      color: "#fff",
    },

    logo: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
    },

    hero: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#f5e6c8",
    },

    heroImg: {
      width: "100%",
      height: "420px",
      objectFit: "cover",
    },

    marquee: {
      background: "linear-gradient(to right,#ff5722,#e91e63)",
      color: "#fff",
      padding: "12px",
      fontWeight: "bold",
      fontSize: "18px",
    },

    templeSection: {
      padding: "40px",
      textAlign: "center",
    },

    sectionTitle: {
      fontSize: "34px",
      color: "#008080",
      marginBottom: "30px",
    },

    cards: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "25px",
    },

    error: {
      color: "red",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "30px",
    },

    card: {
      width: "320px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
      padding: "20px",
    },

    cardImg: {
      width: "100%",
      height: "220px",
      objectFit: "cover",
      borderRadius: "10px",
    },

    cardTitle: {
      color: "#008080",
      margin: "15px 0",
    },

    button: {
      width: "100%",
      marginTop: "15px",
      padding: "10px",
      background: "#008080",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },

    noTemple: {
      fontSize: "20px",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.topHeader}>
        <img
          src={Herotemple}
          alt="Temple"
          style={styles.sideImg}
        />

        <div style={styles.logoSection}>
          <img
            src={herologo}
            alt="Logo"
            style={styles.logo}
          />

          <h2>DarshanEase</h2>
        </div>

        <img
          src={Herotemple2}
          alt="Temple"
          style={styles.sideImg}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <div style={styles.hero}>
        <img
          src={templeBackground}
          alt="Temple Background"
          style={styles.heroImg}
        />
      </div>

      {/* Announcement */}
      <div style={styles.marquee}>
        <marquee>
          Welcome to DarshanEase • Book Temple Darshan Online •
          Safe & Secure Booking • Limited Slots Available •
          Experience Divine Blessings
        </marquee>
      </div>

      {/* Temple Section */}
      <div style={styles.templeSection}>
        <h2 style={styles.sectionTitle}>
          Available Temples
        </h2>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <div style={styles.cards}>
  {loading ? (
    <h3>Loading...</h3>
  ) : temples.length === 0 ? (
    <h3>No temples available.</h3>
  ) : (
    temples.map((temple) => (
      <div key={temple._id} style={styles.card}>
        <img
          src={
            temple.image
              ? `https://darshanease-a82t.onrender.com${temple.image}`
              : templeBackground
          }
          alt={temple.templeName}
          style={styles.cardImg}
          />

        <h3 style={styles.cardTitle}>
          {temple.templeName}
        </h3>

        <p>{temple.location}</p>

        <Link to={`/temples/${temple._id}`}>
          <button style={styles.button}>
            View Details
          </button>
        </Link>
      </div>
    ))
  )}
</div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;