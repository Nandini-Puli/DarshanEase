import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import OrganizerNavbar from "../components/OrganizerNavbar";
import * as Recharts from "recharts";

function OrganizerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    temples: 0,
    darshans: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/organizelogin");
      return;
    }

    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/organizer/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          Loading your temple insights...
        </div>
      </div>
    );
  }

  const data = [
    { name: "Temples", value: stats.temples, color: "#0f766e" },
    { name: "Darshans", value: stats.darshans, color: "#f59e0b" },
    { name: "Bookings", value: stats.bookings, color: "#b45309" },
  ];

  return (
    <div style={styles.page}>
      <OrganizerNavbar />

      <div style={styles.hero}>
        <h1 style={styles.title}>Organizer Dashboard</h1>
        <p style={styles.subtitle}>
          A quick view of your temple operations and darshan activity.
        </p>
      </div>

      <div style={styles.container}>
        <div style={styles.cards}>
          <div style={styles.card("#0f766e")}>
            <span>Temples</span>
            <span style={styles.cardValue}>{stats.temples}</span>
          </div>

          <div style={styles.card("#f59e0b")}>
            <span>Darshans</span>
            <span style={styles.cardValue}>{stats.darshans}</span>
          </div>

          <div style={styles.card("#b45309")}>
            <span>Bookings</span>
            <span style={styles.cardValue}>{stats.bookings}</span>
          </div>
        </div>

        <div style={styles.chartWrap}>
          <Recharts.ResponsiveContainer width="90%" height={350}>
            <Recharts.BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <Recharts.CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <Recharts.XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
              />

              <Recharts.YAxis
                tickLine={false}
                axisLine={false}
              />

              <Recharts.Tooltip />

              <Recharts.Bar
                dataKey="value"
                barSize={52}
                radius={[8, 8, 0, 0]}
              >
                {data.map((item, index) => (
                  <Recharts.Cell
                    key={index}
                    fill={item.color}
                  />
                ))}
              </Recharts.Bar>
            </Recharts.BarChart>
          </Recharts.ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: "40px",
  },

  hero: {
    width: "90%",
    margin: "30px auto 0",
    padding: "30px 32px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    color: "#0f172a",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  container: {
    width: "90%",
    margin: "24px auto 0",
    background: "rgba(255,255,255,0.92)",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "28px",
  },

  card: (color) => ({
    minHeight: "130px",
    background: color,
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.15)",
  }),

  cardValue: {
    fontSize: "34px",
    marginTop: "6px",
  },

  chartWrap: {
    display: "flex",
    justifyContent: "center",
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

export default OrganizerDashboard;