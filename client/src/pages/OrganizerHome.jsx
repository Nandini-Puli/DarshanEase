import { useEffect, useState } from "react";
import API from "../services/api";
import OrganizerNavbar from "../components/OrganizerNavbar";

function OrganizerHome() {
  const [stats, setStats] = useState({
    temples: 0,
    darshans: 0,
    bookings: 0,
    revenue: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [todayDarshans, setTodayDarshans] = useState([]);
  const [templeName, setTempleName] = useState("Your Temple");
  const [organizerName, setOrganizerName] = useState("Organizer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const organizer = JSON.parse(localStorage.getItem("organizer") || "null");

        const [statsRes, bookingsRes, darshansRes, templesRes] = await Promise.all([
          API.get("/organizer/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/organizers/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/darshans/organizer/mydarshans", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/temples"),
        ]);

        const dashboardData = statsRes.data || {};
        const allBookings = bookingsRes.data?.bookings || [];
        const allDarshans = darshansRes.data?.darshans || [];
        const templeList = templesRes.data?.temples || templesRes.data || [];

        const matchedTemple = templeList.find((item) => {
          const organizerId = item.organizerId?._id || item.organizerId;
          return String(organizerId) === String(organizer?._id || organizer?.id || "");
        });

        const recentBookings = [...allBookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        const today = new Date();
        const todaysSchedule = allDarshans.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getFullYear() === today.getFullYear() &&
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getDate() === today.getDate()
          );
        });

        setStats({
          temples: dashboardData.temples || 0,
          darshans: dashboardData.darshans || 0,
          bookings: dashboardData.bookings || 0,
          revenue: dashboardData.revenue || 0,
        });
        setBookings(recentBookings);
        setTodayDarshans(todaysSchedule);
        setTempleName(matchedTemple?.templeName || "Your Temple");
        setOrganizerName(organizer?.username || "Organizer");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Preparing your organizer dashboard…</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <OrganizerNavbar />

      <div style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Organizer Home</p>
          <h1 style={styles.title}>Welcome back, {organizerName}</h1>
          <p style={styles.subtitle}>
            Here is a streamlined overview for {templeName} and your upcoming temple service.
          </p>
        </div>
        <div style={styles.heroBadge}>Live operations</div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Temple</span>
          <strong style={styles.statValue}>{stats.temples}</strong>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Darshans</span>
          <strong style={styles.statValue}>{stats.darshans}</strong>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Bookings</span>
          <strong style={styles.statValue}>{stats.bookings}</strong>
        </div>
        <div style={styles.statCardGold}>
          <span style={styles.statLabel}>Revenue</span>
          <strong style={styles.statValue}>₹{stats.revenue}</strong>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelEyebrow}>Operations</p>
              <h2 style={styles.panelTitle}>Recent Bookings</h2>
            </div>
            <span style={styles.badge}>Latest 5</span>
          </div>

          {bookings.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Ticket</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Temple</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td style={styles.td}>{booking.ticketNumber || "—"}</td>
                      <td style={styles.td}>{booking.userId?.username || "Guest"}</td>
                      <td style={styles.td}>{booking.templeId?.templeName || templeName}</td>
                      <td style={styles.statusCell}>{booking.bookingStatus || booking.paymentStatus || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.empty}>No bookings recorded yet.</div>
          )}
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelEyebrow}>Today</p>
              <h2 style={styles.panelTitle}>Today&apos;s Darshan Schedule</h2>
            </div>
            <span style={styles.badge}>Live</span>
          </div>

          {todayDarshans.length > 0 ? (
            <div style={styles.scheduleList}>
              {todayDarshans.map((darshan) => (
                <div key={darshan._id} style={styles.scheduleCard}>
                  <div>
                    <h3 style={styles.scheduleTitle}>{darshan.darshanName}</h3>
                    <p style={styles.scheduleText}>{darshan.description || "Temple darshan session"}</p>
                  </div>
                  <div style={styles.scheduleMeta}>
                    <span>{darshan.startTime} - {darshan.endTime}</span>
                    <strong>{darshan.availableSeats} seats left</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>No darshan slots scheduled for today.</div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fdfaf1 0%, #f6efe2 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    paddingBottom: "40px",
  },
  hero: {
    width: "min(1180px, 92%)",
    margin: "28px auto 0",
    padding: "28px 30px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.22)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#b45309",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "12px",
    fontWeight: "700",
  },
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(24px, 4vw, 34px)",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "720px",
  },
  heroBadge: {
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "white",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(15, 118, 110, 0.25)",
  },
  summaryGrid: {
    width: "min(1180px, 92%)",
    margin: "22px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  statCard: {
    background: "white",
    padding: "18px 20px",
    borderRadius: "18px",
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
    border: "1px solid rgba(15, 118, 110, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  statCardGold: {
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    color: "#fff",
    padding: "18px 20px",
    borderRadius: "18px",
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  },
  statValue: {
    fontSize: "30px",
    color: "#0f172a",
  },
  contentGrid: {
    width: "min(1180px, 92%)",
    margin: "22px auto 0",
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "20px",
  },
  panel: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.07)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  panelEyebrow: {
    margin: "0 0 4px",
    color: "#b45309",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
  },
  panelTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },
  badge: {
    background: "#ecfeff",
    color: "#0f766e",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px 8px",
    borderBottom: "1px solid #e2e8f0",
    color: "#0f766e",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  td: {
    padding: "12px 8px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontSize: "14px",
  },
  statusCell: {
    padding: "12px 8px",
    borderBottom: "1px solid #f1f5f9",
    color: "#b45309",
    fontWeight: "700",
    fontSize: "14px",
  },
  scheduleList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  scheduleCard: {
    background: "linear-gradient(135deg, #f8faf7 0%, #fef3c7 100%)",
    borderRadius: "16px",
    padding: "14px 16px",
    border: "1px solid rgba(221, 170, 95, 0.18)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  scheduleTitle: {
    margin: "0 0 4px",
    color: "#0f172a",
    fontSize: "16px",
  },
  scheduleText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  scheduleMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    color: "#0f766e",
    fontSize: "13px",
  },
  empty: {
    padding: "24px 10px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fafc",
    borderRadius: "14px",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fdfaf1 0%, #f6efe2 100%)",
  },
  loadingCard: {
    padding: "18px 24px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.1)",
    color: "#0f766e",
    fontWeight: "700",
  },
};

export default OrganizerHome;
