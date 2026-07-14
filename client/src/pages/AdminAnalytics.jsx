import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function AdminAnalytics() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/admin/dashboard");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const monthlyData = (stats.monthlyBookings || []).map((item) => ({
    name: item.name,
    bookings: item.bookings,
    revenue: item.revenue,
  }));

  const pieData = (stats.templeWiseBookings || []).map((item) => ({ name: item.name, value: item.bookings }));

  return (
    <>
      <AdminNavbar />
      <main style={styles.page}>
        <h1 style={styles.title}>Admin Analytics</h1>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.cards}>
          <div style={styles.card}><strong>{stats.totalUsers || 0}</strong><span>Total Users</span></div>
          <div style={styles.card}><strong>{stats.totalOrganizers || 0}</strong><span>Total Organizers</span></div>
          <div style={styles.card}><strong>{stats.totalTemples || 0}</strong><span>Total Temples</span></div>
          <div style={styles.card}><strong>{stats.totalDarshans || 0}</strong><span>Total Darshans</span></div>
          <div style={styles.card}><strong>{stats.totalBookings || 0}</strong><span>Total Bookings</span></div>
          <div style={styles.card}><strong>{stats.todayBookings || 0}</strong><span>Today&apos;s Bookings</span></div>
          <div style={styles.card}><strong>Rs. {stats.totalRevenue || 0}</strong><span>Total Revenue</span></div>
          <div style={styles.card}><strong>Rs. {stats.donationRevenue || 0}</strong><span>Donation Revenue</span></div>
        </div>

        <div style={styles.summaryCard}>
          <p><strong>Popular Temple:</strong> {stats.popularTemple || "N/A"}</p>
          <p><strong>Most Booked Darshan:</strong> {stats.mostBookedDarshan || "N/A"}</p>
        </div>

        <div style={styles.chartGrid}>
          <div style={styles.chartCard}>
            <h3>Monthly Bookings</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <h3>Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <h3>Temple-wise Booking Count</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884d8">
                  {pieData.map((entry, index) => <Cell key={entry.name} fill={["#0f766e", "#3b82f6", "#f59e0b", "#ef4444", "#10b981"][index % 5]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const styles = {
  page: {
    minHeight: "75vh",
    padding: "32px 6%",
    background: "#f5f5f5",
  },
  title: {
    marginTop: 0,
    color: "#0f766e",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  summaryCard: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  chartCard: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  error: {
    color: "#b42318",
  },
};

export default AdminAnalytics;
