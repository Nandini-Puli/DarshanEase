import { NavLink, useNavigate } from "react-router-dom";
import useAuth  from "../hooks/useAuth";

function AdminNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("accountType");
      localStorage.removeItem("user");
      localStorage.removeItem("organizer");
      localStorage.removeItem("admin");
      localStorage.removeItem("username");
      localStorage.removeItem("isLoggedIn");
    }

    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        DarshanEase (Admin)
      </div>

      <div style={styles.menu}>
        <NavLink
          to="/admin-dashboard"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          Users
        </NavLink>

        <NavLink
          to="/organizers"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          Organizers
        </NavLink>

        <NavLink
          to="/profile"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          Profile
        </NavLink>

        <span style={styles.username}>
          {user?.username || "Admin"}
        </span>

        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#008080",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    padding: "6px 10px",
    borderRadius: "5px",
    transition: "0.3s",
  },

  activeLink: {
    backgroundColor: "#ffffff",
    color: "#008080",
  },

  username: {
    backgroundColor: "#ffffff",
    color: "#008080",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default AdminNavbar;