import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      const usersData = Array.isArray(res.data?.users)
        ? res.data.users
        : Array.isArray(res.data)
          ? res.data
          : [];
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "Arial",
    },

    navbar: {
      background: "#008080",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 45px",
    },

    logo: {
      fontSize: "18px",
      fontWeight: "bold",
    },

    nav: {
      display: "flex",
      gap: "20px",
    },

    link: {
      color: "white",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "14px",
    },

    title: {
      textAlign: "center",
      margin: "30px",
      fontSize: "35px",
    },

    table: {
      width: "90%",
      margin: "auto",
      borderCollapse: "collapse",
      background: "#2f3338",
      color: "white",
    },

    th: {
      background: "#24282c",
      padding: "15px",
      border: "1px solid #444",
      textAlign: "left",
    },

    td: {
      padding: "15px",
      border: "1px solid #444",
    },

    view: {
      background: "#0d6efd",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "8px",
    },

    icon: {
      color: "red",
      cursor: "pointer",
      marginRight: "8px",
      fontSize: "18px",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <AdminNavbar />
        <h1 style={styles.title}>Users</h1>
        <p style={{ textAlign: "center", marginTop: "20px" }}>Loading Users...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
         <AdminNavbar />
      <h1 style={styles.title}>Users</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Sl/No</th>
            <th style={styles.th}>UserId</th>
            <th style={styles.th}>User Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Operation</th>
          </tr>
        </thead>

        <tbody>

          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No Users Found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id || user.id || index}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user._id || user.id}</td>
                <td style={styles.td}>{user.username || user.name}</td>
                <td style={styles.td}>{user.email}</td>

              <td style={styles.td}>
                ✏️
                <span style={styles.icon}>🗑️</span>

                <button style={styles.view}>
                  View
                </button>
              </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Users;