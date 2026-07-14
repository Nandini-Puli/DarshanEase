import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

import AdminNavbar from "../components/AdminNavbar";
import DashboardCard from "../components/DashboardCard";
import Loader from "../components/Loader";
import { getDashboardStats } from "../services/adminService";
import { STORAGE_KEYS } from "../utils/constants";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    organizers: 0,
    temples: 0,
    darshans: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();

      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    {
      name: "Users",
      value: stats.users,
      color: "#7B2CBF",
    },
    {
      name: "Organizers",
      value: stats.organizers,
      color: "#0D9898",
    },
    {
      name: "Temples",
      value: stats.temples,
      color: "#FF7F50",
    },
    {
      name: "Darshans",
      value: stats.darshans,
      color: "#F4A261",
    },
    {
      name: "Bookings",
      value: stats.bookings,
      color: "#2E8B57",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={styles.page}>
      <AdminNavbar />

      <h1 style={styles.title}>Admin Dashboard</h1>

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      <div style={styles.container}>
        <div style={styles.cards}>
          <DashboardCard
            title="Users"
            count={stats.users}
            color="#7B2CBF"
          />

          <DashboardCard
            title="Organizers"
            count={stats.organizers}
            color="#0D9898"
          />

          <DashboardCard
            title="Temples"
            count={stats.temples}
            color="#FF7F50"
          />

          <DashboardCard
            title="Darshans"
            count={stats.darshans}
            color="#F4A261"
          />

          <DashboardCard
            title="Bookings"
            count={stats.bookings}
            color="#2E8B57"
          />
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[5, 5, 0, 0]}
                barSize={45}
                animationDuration={800}
                animationBegin={0}
              >
                <LabelList dataKey="value" position="top" fill="#444" fontSize={12} />
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    marginTop: "30px",
    marginBottom: "25px",
    fontSize: "40px",
    color: "#222",
  },

  container: {
    width: "90%",
    margin: "auto",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "35px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "25px",
    marginBottom: "50px",
  },

  chartContainer: {
    width: "100%",
    height: "400px",
    marginTop: "30px",
  },

  error: {
    textAlign: "center",
    color: "red",
    marginBottom: "15px",
    fontWeight: "bold",
  },
};

export default AdminDashboard;