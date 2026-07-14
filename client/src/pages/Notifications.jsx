import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await API.get("/notifications");

      setItems(
        Array.isArray(data?.notifications)
          ? data.notifications
          : []
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, remove) => {
    try {
      if (remove) {
        await API.delete(`/notifications/${id}`);
      } else {
        await API.put(`/notifications/${id}`);
      }

      load();

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <h1>Notifications</h1>

        {!items.length && (
          <p>You have no notifications.</p>
        )}

        {items.map((item) => (
          <article
            key={item._id}
            style={{
              ...styles.card,
              opacity: item.isRead ? 0.65 : 1,
            }}
          >
            <h3>{item.title}</h3>

            <p>{item.message}</p>

            <small>
              {new Date(item.createdAt).toLocaleString()}
            </small>

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() =>
                  update(item._id, false)
                }
                disabled={item.isRead}
              >
                Mark Read
              </button>

              <button
                onClick={() =>
                  update(item._id, true)
                }
                style={styles.delete}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </main>

      <Footer />
    </>
  );
}

const styles = {
  page: {
    minHeight: "75vh",
    padding: "32px 8%",
    background: "#f4f7f5",
  },

  card: {
    margin: "12px 0",
    padding: "18px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },

  delete: {
    marginLeft: "10px",
    background: "#b42318",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Notifications;