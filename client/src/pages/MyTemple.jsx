import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import OrganizerNavbar from "../components/OrganizerNavbar";

function MyTemple() {
  const { id } = useParams();

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemple();
  }, [id]);

  const fetchTemple = async () => {
    try {
      const token = localStorage.getItem("token");

      if (id) {
        const res = await API.get(`/temples/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTemple(res.data);
        return;
      }

      const response = await API.get("/temples", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const templeList = response.data?.temples || response.data || [];
      const organizer = JSON.parse(localStorage.getItem("organizer") || "null");
      const matchedTemple = templeList.find((item) => {
        const organizerId = item.organizerId?._id || item.organizerId;
        return String(organizerId) === String(organizer?._id || organizer?.id || "");
      });

      setTemple(matchedTemple || templeList[0] || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Loading temple details…</div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Temple not found</div>
      </div>
    );
  }

console.log("Temple:", temple);
console.log("Image:", temple.image);
console.log("Image URL:", `${import.meta.env.VITE_API_URL.replace("/api", "")}${temple.image}`);

  return (
    <div style={styles.page}>
      <OrganizerNavbar />

      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Temple profile</p>
          <h1 style={styles.heading}>My Temple</h1>
        </div>
        <Link to={`/updatetemple/${temple._id}`} style={styles.link}>
          <button style={styles.editBtn}>Edit Temple</button>
        </Link>
      </div>

      <div style={styles.card}>
        <img
          src={`https://darshanease-a82t.onrender.com${temple.image}`}
          alt={temple.templeName} style={styles.image}/>
        <div style={styles.content}>
          <h2 style={styles.templeName}>{temple.templeName}</h2>
          <p style={styles.meta}>Location</p>
          <p style={styles.value}>{temple.location}</p>
          <p style={styles.meta}>Description</p>
          <p style={styles.value}>{temple.description}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: "40px",
  },

  header: {
    width: "90%",
    margin: "28px auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  eyebrow: {
    margin: "0 0 6px",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#b45309",
    fontWeight: "700",
    fontSize: "12px",
  },

  heading: {
    margin: 0,
    fontSize: "34px",
    color: "#0f172a",
  },

  link: {
    textDecoration: "none",
  },

  editBtn: {
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 10px 22px rgba(15, 118, 110, 0.25)",
  },

  card: {
    width: "min(900px, 90%)",
    margin: "0 auto",
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },

  image: {
    flex: "1 1 280px",
    width: "100%",
    height: "320px",
    objectFit: "cover",
    borderRadius: "18px",
  },

  content: {
    flex: "1 1 280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  templeName: {
    margin: "0 0 12px",
    color: "#0f172a",
    fontSize: "28px",
  },

  meta: {
    margin: "12px 0 4px",
    color: "#b45309",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "12px",
  },

  value: {
    margin: 0,
    color: "#334155",
    lineHeight: 1.7,
  },

  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
  },

  loadingCard: {
    padding: "20px 28px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.1)",
    color: "#0f766e",
    fontWeight: "700",
  },
};

export default MyTemple;