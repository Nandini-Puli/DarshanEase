import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setProfile(res.data?.profile || res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div style={styles.loading}>Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div style={styles.page}>
        {message ? <p style={styles.message}>{message}</p> : null}
        <div style={styles.card}>
          <h2 style={styles.title}>Admin Profile</h2>
          <p><strong>Name:</strong> {profile?.username || "Admin"}</p>
          <p><strong>Email:</strong> {profile?.email || "-"}</p>
          <p><strong>Phone:</strong> {profile?.phone || "-"}</p>
          <p><strong>Role:</strong> {profile?.role || "user"}</p>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "30px 20px",
  },
  card: {
    maxWidth: "600px",
    margin: "20px auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  },
  title: {
    marginTop: 0,
    color: "#222",
  },
  loading: {
    padding: "30px",
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    color: "red",
    marginBottom: "10px",
  },
};

export default AdminProfile;
