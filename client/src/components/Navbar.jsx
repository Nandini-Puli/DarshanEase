import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

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
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-text">
          Darshan-Ease
        </Link>
      </div>

      <div className="menu">
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/temples" className="nav-link">
          Temples
        </Link>

        <Link to="/mybookings" className="nav-link">
          My Bookings
        </Link>

        <Link to="/donations" className="nav-link">
          My Donations
        </Link>

        <Link to="/admin-dashboard" className="nav-link">
          Dashboard
        </Link>

        <Link to="/profile" className="nav-link">
          Profile
        </Link>

        {isLoggedIn ? (
          <>
            <span className="username">
              Welcome, {username}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;