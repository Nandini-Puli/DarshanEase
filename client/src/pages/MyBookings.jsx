import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import qrCode from "../assets/images/qr.png";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab] = useState("all");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bookings");
      const result = data?.bookings ?? data;
      setBookings(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this pending booking?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel booking.");
    }
  };

  const downloadTicket = (booking) => {
    const text = `DarshanEase Ticket\nTicket: ${booking.ticketNumber || "N/A"}\nTemple: ${booking.templeId?.templeName}\nDarshan: ${booking.slotId?.darshanName}\nDate: ${new Date(booking.slotId?.date || booking.createdAt).toLocaleDateString()}\nPersons: ${booking.numberOfPersons}\nAmount: Rs. ${booking.totalPrice}`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking.ticketNumber || "darshan-ticket"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBookings = bookings.filter((booking) => {
    const status = booking.bookingStatus?.toLowerCase() || "";
    const matchesTab = tab === "all" || (tab === "upcoming" && booking.bookingStatus !== "Cancelled" && booking.bookingStatus !== "Completed") || (tab === "completed" && booking.bookingStatus === "Confirmed") || (tab === "cancelled" && booking.bookingStatus === "Cancelled");
    const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();
    const haystack = `${booking.ticketNumber || ""} ${booking.templeId?.templeName || ""} ${booking.slotId?.darshanName || ""}`.toLowerCase();
    return matchesTab && matchesStatus && haystack.includes(search.toLowerCase());
  });

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>My Bookings</h2>
          <button style={styles.secondaryButton} onClick={() => navigate("/feedback")}>Leave Feedback</button>
        </div>
        {error && <p role="alert" style={styles.error}>{error}</p>}
        {!error && !bookings.length && <p>No bookings found.</p>}
        <div style={styles.filters}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings" style={styles.input} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.input}>
            <option value="all">All status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div style={styles.tabs}>
          <button style={tab === "all" ? styles.activeTab : styles.tab} onClick={() => setTab("all")}>All</button>
        </div>
        <section style={styles.grid}>
          {filteredBookings.map((booking) => (
            <article key={booking._id} style={styles.card}>
              {booking.templeId?.image && <img src={`https://darshanease-a82t.onrender.com${booking.templeId.image}`} alt={booking.templeId?.templeName || "Temple"} style={styles.image} />}
              <h2>{booking.templeId?.templeName || "Temple"}</h2>
              <p>{booking.slotId?.darshanName || "Darshan"}</p>
              <p><b>Booking date:</b> {new Date(booking.createdAt).toLocaleDateString()}</p>
              <p><b>Darshan date:</b> {booking.slotId?.date ? new Date(booking.slotId.date).toLocaleDateString() : "-"}</p>
              <p>{booking.numberOfPersons} devotee(s) | Rs. {booking.totalPrice}</p>
              <p><b>Booking:</b> {booking.bookingStatus}</p>
              <p><b>Payment:</b> {booking.paymentStatus}</p>
              {booking.bookingStatus === "Confirmed" && <img src={qrCode} alt="Ticket QR code" style={styles.qr} />}
              <div style={styles.buttonRow}>
                {booking.bookingStatus === "Confirmed" && <button onClick={() => downloadTicket(booking)}>Download Ticket</button>}
                {booking.bookingStatus === "Pending" && <button style={styles.cancel} onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>}
                {booking.bookingStatus === "Confirmed" && <button style={styles.secondaryButton} onClick={() => navigate("/feedback", { state: { booking } })}>Feedback</button>}
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

const styles = {
  page: { minHeight: "75vh", padding: "32px 6%", background: "#f4f7f5" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" },
  title: { margin: 0, color: "#0f766e" },
  filters: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "14px" },
  input: { padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db" },
  tabs: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  tab: { border: "1px solid #d1d5db", background: "white", padding: "8px 12px", borderRadius: "999px", cursor: "pointer" },
  activeTab: { border: "1px solid #0f766e", background: "#0f766e", color: "white", padding: "8px 12px", borderRadius: "999px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 3px 12px #0001" },
  image: { width: "90%", height: 300, borderRadius: 8, objectFit: "cover" },
  qr: { display: "block", width: 90, height: 90, margin: "10px 0" },
  buttonRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" },
  cancel: { background: "#b42318", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" },
  secondaryButton: { background: "#0f766e", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" },
  error: { color: "#b42318" },
};

export default MyBookings;
