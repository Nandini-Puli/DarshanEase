import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import OrganizerNavbar from "../components/OrganizerNavbar";

function MyDarshans() {
  const [darshans, setDarshans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDarshans();
  }, []);

  const fetchDarshans = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/darshans/organizer/mydarshans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setDarshans(Array.isArray(res.data?.darshans) ? res.data.darshans : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Darshan?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/darshans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchDarshans();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Move styles here
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
      fontFamily: "Inter, Arial, sans-serif",
      paddingBottom: "40px",
    },

    top: {
      width: "90%",
      margin: "28px auto 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },

    title: {
      flex: 1,
      textAlign: "center",
      fontSize: "34px",
      color: "#0f172a",
      margin: 0,
    },

    create: {
      background: "linear-gradient(135deg, #0f766e, #0d9488)",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: "700",
      boxShadow: "0 10px 24px rgba(15, 118, 110, 0.2)",
    },

    grid: {
      width: "90%",
      margin: "20px auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "24px",
    },

    card: {
      background: "rgba(255,255,255,0.96)",
      padding: "22px",
      borderRadius: "22px",
      boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
      border: "1px solid rgba(221, 170, 95, 0.2)",
    },

    heading: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#0f766e",
      marginBottom: "12px",
    },

    label: {
      fontWeight: "700",
      color: "#374151",
    },

    text: {
      margin: "6px 0",
      color: "#475569",
      lineHeight: 1.6,
    },

    buttons: {
      display: "flex",
      gap: "12px",
      marginTop: "18px",
    },

    edit: {
      flex: 1,
      background: "#f59e0b",
      color: "white",
      border: "none",
      padding: "10px 12px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "700",
    },

    delete: {
      flex: 1,
      background: "#b91c1c",
      color: "white",
      border: "none",
      padding: "10px 12px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "700",
    },

    empty: {
      padding: "24px",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.9)",
      boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
      color: "#475569",
      textAlign: "center",
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

  // ✅ Now styles exist before they are used
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Loading your darshans...</div>
      </div>
    );
  }

  return (
    <>
    <OrganizerNavbar/>
    <div style={styles.page}>

      <div style={styles.top}>
        <div style={{ width: "150px" }} />
        <h1 style={styles.title}>My Darshans</h1>
        <Link to="/createdarshan">
          <button style={styles.create}>Create Darshan</button>
        </Link>
      </div>

      <div style={styles.grid}>
        {darshans.length === 0 ? (
          <div style={styles.empty}>No Darshans Available</div>
        ) : (
          darshans.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.heading}>{item.darshanName}</div>

              <p style={styles.text}>
                <span style={styles.label}>Date:</span> {new Date(item.date).toLocaleDateString()}
              </p>

              <p style={styles.text}>
                <span style={styles.label}>Start Time:</span> {item.startTime}
              </p>

              <p style={styles.text}>
                <span style={styles.label}>End Time:</span> {item.endTime}
              </p>

              <p style={styles.text}>
                <span style={styles.label}>Seats:</span> {item.availableSeats}
              </p>

              <p style={styles.text}>
                <span style={styles.label}>Price:</span> ₹{item.price}
              </p>

              <p style={styles.text}>
                <span style={styles.label}>Description:</span>
                <br />
                {item.description}
              </p>

              <div style={styles.buttons}>
                <Link to={`/editdarshan/${item._id}`} style={{ flex: 1 }}>
                  <button style={styles.edit}>Edit</button>
                </Link>

                <button style={styles.delete} onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}

export default MyDarshans;