import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Logintemple from "../assets/images/backgrounds/Logintemple.jpg";

function OrganizeRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/organizer/register", {
        username,
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("accountType", data.accountType);
      localStorage.setItem("organizer", JSON.stringify(data.organizer));

      if (data.organizer) {
        localStorage.setItem("username", data.organizer.username);
        localStorage.setItem("role", data.organizer.role);
      }

      alert("Organizer Registered Successfully");

      navigate("/organizeLogin");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.imageSection}>
          <img src={Logintemple} alt="Temple" style={styles.image} />
          <div style={styles.overlayCard}>
            <p style={styles.badge}>Temple Partner</p>
            <h2 style={styles.overlayTitle}>Welcome to DarshanEase</h2>
            <p style={styles.overlayText}>
              Create your organizer account and begin managing sacred darshans with ease.
            </p>
          </div>
        </div>

        <div style={styles.formSection}>
          <p style={styles.eyebrow}>Organizer signup</p>
          <h1 style={styles.heading}>Create your organizer account</h1>
          <p style={styles.subtitle}>Add your temple, manage slots, and serve devotees smoothly.</p>

          <form onSubmit={handleRegister}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>

          <p style={styles.signup}>
            Already have an account?{" "}
            <Link to="/organizelogin" style={styles.signupLink}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
  },

  card: {
    width: "100%",
    maxWidth: "1100px",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    padding: "24px",
    borderRadius: "24px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.15)",
    gap: "24px",
    overflow: "hidden",
    border: "1px solid rgba(221, 170, 95, 0.2)",
    flexWrap: "wrap",
  },

  imageSection: {
    flex: "1 1 320px",
    position: "relative",
    minHeight: "480px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "18px",
  },

  overlayCard: {
    position: "absolute",
    left: "20px",
    right: "20px",
    bottom: "20px",
    background: "rgba(7, 30, 32, 0.76)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    padding: "20px",
    borderRadius: "16px",
  },

  badge: {
    display: "inline-block",
    background: "#f59e0b",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },

  overlayTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
  },

  overlayText: {
    margin: 0,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.82)",
  },

  formSection: {
    flex: "1 1 320px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "18px 8px",
  },

  eyebrow: {
    margin: "0 0 8px",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#b45309",
    fontWeight: "700",
    fontSize: "12px",
  },

  heading: {
    color: "#0f172a",
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px",
    lineHeight: 1.2,
  },

  subtitle: {
    color: "#4b5563",
    margin: "0 0 20px",
    lineHeight: 1.6,
  },

  label: {
    color: "#374151",
    marginBottom: "8px",
    fontWeight: "700",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    marginBottom: "16px",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s ease",
  },

  button: {
    width: "100%",
    padding: "13px 16px",
    background: "linear-gradient(135deg, #d97706, #b45309)",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 10px 24px rgba(217, 119, 6, 0.25)",
  },

  signup: {
    marginTop: "18px",
    color: "#6b7280",
    fontSize: "15px",
  },

  signupLink: {
    color: "#b45309",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default OrganizeRegister;