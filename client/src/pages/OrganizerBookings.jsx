import { useEffect, useState } from "react";
import API from "../services/api";
import OrganizerNavbar from "../components/OrganizerNavbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function OrganizerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [templeFilter, setTempleFilter] = useState("all");
  const [darshanFilter, setDarshanFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/organizers/bookings");
      setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, action) => {
    try {
      await API.patch(`/organizers/bookings/${id}/status`, { action });
      setMessage(action === "approve" ? "Booking approved." : "Booking rejected.");
      await loadBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update booking.");
    }
  };

  const exportBookings = async () => {
    try {
      const response = await API.get("/organizers/bookings/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "bookings.csv";
      link.click();
      window.URL.revokeObjectURL(url);
      setMessage("Booking export downloaded.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to export bookings.");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayBookings = bookings.filter((booking) => {
    const createdAt = new Date(booking.createdAt);
    return createdAt >= today;
  }).length;

  const todayIncome = bookings
    .filter((booking) => {
      const createdAt = new Date(booking.createdAt);
      return createdAt >= today && booking.bookingStatus === "Confirmed" && booking.paymentStatus === "Success";
    })
    .reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);

  const upcomingDarshans = bookings.filter((booking) => {
    const darshanDate = new Date(booking.slotId?.date || booking.createdAt);
    return darshanDate >= today && booking.bookingStatus !== "Cancelled";
  }).length;

  const templeOptions = [...new Set(bookings.map((booking) => booking.templeId?.templeName).filter(Boolean))];
  const darshanOptions = [...new Set(bookings.map((booking) => booking.slotId?.darshanName).filter(Boolean))];

  const filteredBookings = bookings.filter((booking) => {
    const haystack = `${booking.ticketNumber || ""} ${booking.templeId?.templeName || ""} ${booking.slotId?.darshanName || ""}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesTemple = templeFilter === "all" || booking.templeId?.templeName === templeFilter;
    const matchesDarshan = darshanFilter === "all" || booking.slotId?.darshanName === darshanFilter;
    const matchesDate = !dateFilter || new Date(booking.createdAt).toISOString().slice(0, 10) === dateFilter;
    return matchesSearch && matchesTemple && matchesDarshan && matchesDate;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <OrganizerNavbar />
      <main style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>Organizer Booking Dashboard</h2>
            <p style={styles.subtitle}>Manage bookings, approvals, and export your booking records.</p>
          </div>
          <button style={styles.exportButton} onClick={exportBookings}>Export CSV</button>
        </div>

        {message && <p style={styles.message}>{message}</p>}

        <div style={styles.statsGrid}>
          <div style={styles.statCard}><strong>{todayBookings}</strong><span>Today&apos;s bookings</span></div>
          <div style={styles.statCard}><strong>Rs. {todayIncome}</strong><span>Today&apos;s income</span></div>
          <div style={styles.statCard}><strong>{bookings.length}</strong><span>Total bookings</span></div>
          <div style={styles.statCard}><strong>{upcomingDarshans}</strong><span>Upcoming darshans</span></div>
        </div>

        <div style={styles.filters}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ticket/temple/darshan" style={styles.input} />
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={styles.input} />
          <select value={templeFilter} onChange={(e) => setTempleFilter(e.target.value)} style={styles.input}>
            <option value="all">All temples</option>
            {templeOptions.map((temple) => (
              <option key={temple} value={temple}>{temple}</option>
            ))}
          </select>
          <select value={darshanFilter} onChange={(e) => setDarshanFilter(e.target.value)} style={styles.input}>
            <option value="all">All darshans</option>
            {darshanOptions.map((darshan) => (
              <option key={darshan} value={darshan}>{darshan}</option>
            ))}
          </select>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ticket</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Temple</th>
                <th style={styles.th}>Darshan</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
  {filteredBookings.map((booking, index) => (
    <tr key={booking._id}>
      <td
        style={{
          ...styles.td,
          ...(index === filteredBookings.length - 1
            ? styles.lastRow
            : {}),
        }}
      >
        {booking.ticketNumber || "-"}
      </td>

      <td style={styles.td}>
        {booking.userId?.username || "Guest"}
      </td>

      <td style={styles.td}>
        {booking.templeId?.templeName || "-"}
      </td>

      <td style={styles.td}>
        {booking.slotId?.darshanName || "-"}
      </td>

      <td style={styles.td}>
        {booking.slotId?.date
          ? new Date(booking.slotId.date).toLocaleDateString()
          : new Date(booking.createdAt).toLocaleDateString()}
      </td>

      <td style={styles.td}>
        {booking.bookingStatus}
      </td>

      <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      {booking.bookingStatus !== "Confirmed" && (
                        <button style={styles.approveButton} onClick={() => handleStatus(booking._id, "approve")}>Approve</button>
                      )}
                      {booking.bookingStatus !== "Cancelled" && (
                        <button style={styles.rejectButton} onClick={() => handleStatus(booking._id, "reject")}>Reject</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredBookings.length && <p style={styles.empty}>No bookings match your filters.</p>}
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
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    color: "#0f766e",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#4b5563",
  },
  exportButton: {
    background: "#0f766e",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    background: "#ecfdf3",
    color: "#065f46",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },
  statCard: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  tableWrap: {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
},

table: {
  width: "100%",
  borderCollapse: "collapse",
},

th: {
  background: "#f8fafc",
  color: "#334155",
  fontWeight: "700",
  textAlign: "center",
  padding: "16px",
  borderBottom: "2px solid #e5e7eb",
},

td: {
  padding: "16px",
  color: "#475569",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle",
},

lastRow: {
  borderBottom: "none",
},

  actionGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  approveButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  rejectButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  empty: {
    color: "#6b7280",
    padding: "16px 0",
  },
};

export default OrganizerBookings;
