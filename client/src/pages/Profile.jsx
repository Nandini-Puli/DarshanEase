import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function Profile({ useAdminLayout = false }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    preferredTemple: "",
    profileImage: "",
  });
  const [stats, setStats] = useState({
    bookingCount: 0,
    donationCount: 0,
    feedbackCount: 0,
    templeCount: 0,
    darshanCount: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const NavbarComponent = useAdminLayout ? AdminNavbar : Navbar;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      const profileData = res.data?.profile || res.data;
      setProfile(profileData);
      setFormData({
        username: profileData.username || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        role: profileData.role || "",
        preferredTemple: profileData.preferredTemple || "",
        profileImage: profileData.profileImage || "",
      });
      setStats(res.data?.stats || {});
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await API.put("/profile", {
        username: formData.username,
        phone: formData.phone,
        profileImage: formData.profileImage || "",
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setProfile(res.data.user);
      setMessage("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Profile update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    try {
      const res = await API.put("/profile/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setMessage(res.data?.message || "Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Password change failed");
    }
  };

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently joined";

  const initials = (formData.username || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const recentActivities = [
    { title: "Booked VIP Darshan", date: "Today", detail: "Premium access reserved successfully" },
    { title: "Donation Successful", date: "Yesterday", detail: "Temple offering completed" },
    { title: "Feedback Submitted", date: "2 days ago", detail: "Your experience was shared" },
    { title: "Booking Confirmed", date: "3 days ago", detail: "Your slot is ready" },
  ];

  const quickActions = [
    { label: "Book Darshan", to: "/temples" },
    { label: "My Bookings", to: "/mybookings" },
    { label: "My Donations", to: "/donations" },
    { label: "Browse Temples", to: "/temples" },
    { label: "Notifications", to: "/notifications" },
  ];

  if (loading) {
    return (
      <>
        <NavbarComponent />
        <div style={styles.loadingWrap}>
          <div style={styles.loadingCard}>Loading profile…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarComponent />
      <div style={styles.page}>
        {message ? <div style={styles.message}>{message}</div> : null}

        <div style={styles.shell}>
          <section style={styles.heroCard}>
            <div style={styles.heroContent}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatar}>{initials}</div>
              </div>

              <div style={styles.heroInfo}>
                <div style={styles.heroTopRow}>
                  <div>
                    <p style={styles.eyebrow}>Account</p>
                    <h1 style={styles.name}>{formData.username || "User Name"}</h1>
                    <p style={styles.email}>{formData.email || "you@example.com"}</p>
                  </div>
                  <button type="button" style={styles.editButton} onClick={() => setIsEditing((value) => !value)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <div style={styles.metaRow}>
                  <span style={styles.metaPill}>Joined {joinedDate}</span>
                  <span style={styles.metaPill}>Role: {formData.role || "User"}</span>
                </div>
              </div>
            </div>
          </section>

          <div style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <section style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <p style={styles.panelEyebrow}>Account</p>
                    <h2 style={styles.panelTitle}>Account Information</h2>
                  </div>
                </div>

                <form onSubmit={handleUpdate} style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Full name"
                      style={styles.input}
                      disabled={!isEditing}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <input
                      type="email"
                      value={formData.email}
                      placeholder="Email address"
                      readOnly
                      style={{ ...styles.input, background: "#f8fafc" }}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      style={styles.input}
                      disabled={!isEditing}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      placeholder="Profile photo URL"
                      style={styles.input}
                      disabled={!isEditing}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      name="preferredTemple"
                      value={formData.preferredTemple}
                      onChange={handleChange}
                      placeholder="Preferred temple"
                      style={styles.input}
                      disabled={!isEditing}
                    />
                  </div>

                  <div style={styles.infoRow}>
                    <div style={styles.infoCard}>
                      <span style={styles.infoLabel}>Account Status</span>
                      <strong style={styles.infoValue}>Active</strong>
                    </div>
                    <div style={styles.infoCard}>
                      <span style={styles.infoLabel}>Role</span>
                      <strong style={styles.infoValue}>{formData.role || "User"}</strong>
                    </div>
                  </div>

                  {isEditing ? (
                    <button type="submit" style={styles.primaryButton} disabled={updating}>
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  ) : null}
                </form>
              </section>

              <section style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <p style={styles.panelEyebrow}>Security</p>
                    <h2 style={styles.panelTitle}>Password & Security</h2>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      placeholder="Current password"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      placeholder="New password"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      style={styles.input}
                    />
                  </div>

                  <button type="submit" style={styles.secondaryButton}>
                    Update Password
                  </button>
                </form>
              </section>
            </div>

            <div style={styles.rightColumn}>
              <section style={styles.statsSection}>
                <div style={styles.statCard}>
                  <strong style={styles.statValue}>{stats.bookingCount || 0}</strong>
                  <span style={styles.statLabel}>Bookings</span>
                </div>
                <div style={styles.statCard}>
                  <strong style={styles.statValue}>{stats.donationCount || 0}</strong>
                  <span style={styles.statLabel}>Donations</span>
                </div>
                <div style={styles.statCard}>
                  <strong style={styles.statValue}>{stats.feedbackCount || 0}</strong>
                  <span style={styles.statLabel}>Feedback</span>
                </div>
                <div style={styles.statCard}>
                  <strong style={styles.statValue}>{stats.darshanCount || 0}</strong>
                  <span style={styles.statLabel}>Upcoming Darshans</span>
                </div>
              </section>

              <section style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <p style={styles.panelEyebrow}>Activity</p>
                    <h2 style={styles.panelTitle}>Recent Activity</h2>
                  </div>
                </div>

                <div style={styles.timeline}>
                  {recentActivities.map((item, index) => (
                    <div key={item.title} style={styles.timelineItem}>
                      <div style={styles.timelineDot} />
                      <div style={{ flex: 1 }}>
                        <div style={styles.timelineTopRow}>
                          <strong style={styles.timelineTitle}>{item.title}</strong>
                          <span style={styles.timelineDate}>{item.date}</span>
                        </div>
                        <p style={styles.timelineText}>{item.detail}</p>
                        {index < recentActivities.length - 1 ? <div style={styles.divider} /> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <p style={styles.panelEyebrow}>Quick Links</p>
                    <h2 style={styles.panelTitle}>Quick Actions</h2>
                  </div>
                </div>

                <div style={styles.actionGrid}>
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.to} style={styles.actionButton}>
                      {action.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
    padding: "30px 24px 40px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  shell: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  heroCard: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },
  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  avatarWrap: {
    flexShrink: 0,
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0f766e, #f59e0b)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "34px",
    fontWeight: "700",
    boxShadow: "0 12px 30px rgba(15, 118, 110, 0.2)",
  },
  heroInfo: {
    flex: 1,
  },
  heroTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: "0 0 6px",
    color: "#b45309",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
  },
  name: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(24px, 3vw, 30px)",
  },
  email: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },
  editButton: {
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(15, 118, 110, 0.25)",
  },
  metaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  metaPill: {
    background: "#f8fafc",
    color: "#0f766e",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  message: {
    maxWidth: "1200px",
    margin: "0 auto 16px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "#ecfeff",
    color: "#0f766e",
    border: "1px solid rgba(15, 118, 110, 0.16)",
    fontWeight: "600",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.9fr",
    gap: "20px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  panel: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.07)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },
  panelHeader: {
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
  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "12px 14px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginTop: "6px",
  },
  infoCard: {
    background: "#fcfbf8",
    borderRadius: "14px",
    padding: "12px 14px",
    border: "1px solid #f1e7d8",
  },
  infoLabel: {
    display: "block",
    fontSize: "12px",
    color: "#b45309",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: "700",
    marginBottom: "6px",
  },
  infoValue: {
    color: "#0f172a",
    fontSize: "15px",
  },
  primaryButton: {
    alignSelf: "flex-start",
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "white",
    border: "none",
    padding: "11px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(15, 118, 110, 0.25)",
  },
  secondaryButton: {
    alignSelf: "flex-start",
    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    color: "white",
    border: "none",
    padding: "11px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
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
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  statValue: {
    fontSize: "26px",
    color: "#0f172a",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  timelineItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0f766e, #f59e0b)",
    marginTop: "6px",
    flexShrink: 0,
  },
  timelineTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },
  timelineTitle: {
    color: "#0f172a",
    fontSize: "14px",
  },
  timelineDate: {
    color: "#b45309",
    fontSize: "12px",
    fontWeight: "700",
  },
  timelineText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  divider: {
    height: "1px",
    background: "#eef2f7",
    marginTop: "10px",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },
  actionButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "999px",
    background: "#f8fafc",
    color: "#0f766e",
    fontWeight: "700",
    textDecoration: "none",
    border: "1px solid #e2e8f0",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  loadingWrap: {
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
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

export default Profile;
