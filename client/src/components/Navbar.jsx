import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organizer");
    localStorage.removeItem("admin");
    localStorage.removeItem("username");
    localStorage.removeItem("accountType");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoText}>
          Darshan-Ease
        </Link>
      </div>

      <div style={styles.menu}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        <Link to="/temples" style={styles.link}>
          Temples
        </Link>

        <Link to="/mybookings" style={styles.link}>
          My Bookings
        </Link>

        <Link to="/donations" style={styles.link}>
          My Donations
        </Link>

        <Link to="/admin-dashboard" style={styles.link}>
          Dashboard
        </Link>

        <Link to="/profile" style={styles.link}>
          Profile
        </Link>

        {isLoggedIn ? (
          <>
            <span style={styles.username}>
              Welcome, {username}
            </span>

            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>

            <Link to="/register" style={styles.registerButton}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#008080",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    display: "flex",
    alignItems: "center",
  },

  logoText: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },

  username: {
    color: "#FFD54F",
    fontWeight: "bold",
    fontSize: "15px",
  },

  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },

  registerButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    fontWeight: "600",
  },
};

export default Navbar;