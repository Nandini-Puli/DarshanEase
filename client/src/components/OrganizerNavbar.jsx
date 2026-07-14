import { Link, useNavigate } from "react-router-dom";

function OrganizerNavbar() {
  const navigate = useNavigate();

  const storedOrganizer = localStorage.getItem("organizer");
  const organizer = storedOrganizer ? JSON.parse(storedOrganizer) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organizer");
    localStorage.removeItem("admin");
    localStorage.removeItem("username");
    localStorage.removeItem("accountType");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/organizelogin");
  };

  const styles = {
    navbar: {
      background: "#008080",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
    },

    logo: {
      fontSize: "20px",
      fontWeight: "bold",
    },

    menu: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },

    link: {
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize:"15px"
    },

    username: {
      fontWeight: "bold",
    },

    button: {
      background: "transparent",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Darshan-Ease (Organizer)</div>

      <div style={styles.menu}>
        <Link to="/organizerhome" style={styles.link}>
          Home
        </Link>

        <Link to="/mytemple" style={styles.link}>
          My Temple
        </Link>

        <Link to="/mydarshans" style={styles.link}>
          Darshans
        </Link>

        <Link to="/organizer-bookings" style={styles.link}>
          Bookings
        </Link>

        <Link to="/organizer-dashboard" style={styles.link}>
          Dashboard
        </Link>


        <Link to="/organizerprofile" style={styles.link}>
          Profile
        </Link>

        <span style={styles.username}>
          {organizer?.username}
        </span>

        <button
          style={styles.button}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default OrganizerNavbar;