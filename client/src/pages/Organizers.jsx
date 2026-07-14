import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

function Organizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const res = await API.get("/organizers");
      const organizersData = Array.isArray(res.data?.organizers)
        ? res.data.organizers
        : Array.isArray(res.data)
          ? res.data
          : [];
      setOrganizers(organizersData);
    } catch (err) {
      console.error(err);
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganizer = async (id) => {
    if (!window.confirm("Delete this organizer?")) return;

    try {
      await API.delete(`/organizers/${id}`);

      setOrganizers(
        organizers.filter((organizer) => organizer._id !== id)
      );

      alert("Organizer deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Unable to delete organizer");
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
      marginLeft: "10px",
    },

    delete: {
      background: "red",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px",
    },

    loading: {
      textAlign: "center",
      marginTop: "50px",
      fontSize: "22px",
    },
  };

  if (loading) {
    return <h2 style={styles.loading}>Loading Organizers...</h2>;
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />

      <h1 style={styles.title}>Organizers</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Sl.No</th>
            <th style={styles.th}>Organizer ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Operations</th>
          </tr>
        </thead>

        <tbody>
          {organizers.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No Organizers Found
              </td>
            </tr>
          ) : (
            organizers.map((organizer, index) => (
              <tr key={organizer._id}>
                <td style={styles.td}>{index + 1}</td>

                <td style={styles.td}>
                  {organizer._id}
                </td>

                <td style={styles.td}>
                  {organizer.username}
                </td>

                <td style={styles.td}>
                  {organizer.email}
                </td>

                <td style={styles.td}>
                  <Link
                    to={`/organizers/${organizer._id}`}
                  >
                    <button style={styles.view}>
                      View
                    </button>
                  </Link>

                  <button
                    style={styles.delete}
                    onClick={() =>
                      deleteOrganizer(organizer._id)
                    }
                  >
                    Delete
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

export default Organizers;