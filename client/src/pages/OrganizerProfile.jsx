import { useEffect, useState } from "react";
import API from "../services/api";
import OrganizerNavbar from "../components/OrganizerNavbar";
import { getOrganizerProfile } from "../services/organizerService";

function OrganizerProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    templeCount: 0,
    darshanCount: 0,
    bookingCount: 0,
    revenue: 0,
    activeDarshanSlots: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    profileImage: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileData, dashboardRes, darshansRes, templesRes] = await Promise.all([
        getOrganizerProfile(),
        API.get("/organizer/dashboard"),
        API.get("/darshans/organizer/mydarshans"),
        API.get("/temples"),
      ]);

      const organizerProfile = profileData?.profile || null;
      const dashboardData = dashboardRes?.data || {};
      const darshans = darshansRes?.data?.darshans || [];
      const templeList = templesRes?.data?.temples || templesRes?.data || [];
      const organizer = JSON.parse(localStorage.getItem("organizer") || "null");
      const matchedTemple = templeList.find((item) => {
        const organizerId = item.organizerId?._id || item.organizerId;
        return String(organizerId) === String(organizer?._id || organizer?.id || "");
      });

      setProfile({
        ...organizerProfile,
        templeName: matchedTemple?.templeName || organizerProfile?.templeName || "Temple not assigned",
        templeLocation: matchedTemple?.location || organizerProfile?.templeLocation || "Location not updated",
      });
      setFormData({
        username: organizerProfile?.username || "",
        phone: organizerProfile?.phone || "",
        profileImage: organizerProfile?.profileImage || "",
      });
      setStats({
        templeCount: profileData?.stats?.templeCount || 0,
        darshanCount: profileData?.stats?.darshanCount || 0,
        bookingCount: profileData?.stats?.bookingCount || 0,
        revenue: dashboardData?.revenue || 0,
        activeDarshanSlots: darshans.filter((item) => item.isActive !== false).length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await API.put("/organizers/profile", {
        username: formData.username,
        phone: formData.phone,
        profileImage: formData.profileImage,
      });

      const updatedProfile = response.data?.user || response.data?.profile || profile;
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New passwords do not match.");
      setPasswordSaving(false);
      return;
    }

    try {
      const response = await API.put("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setMessage(response.data?.message || "Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>Preparing your profile…</div>
      </div>
    );
  }

  const initials = (profile?.username || "O")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={styles.page}>
      <OrganizerNavbar />

      <div style={styles.shell}>
        <section style={styles.heroCard}>
          <div style={styles.heroContent}>
            <div style={styles.avatarWrap}>
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Organizer" style={styles.avatarImage} />
              ) : (
                <div style={styles.avatar}>{initials}</div>
              )}
            </div>

            <div style={styles.heroInfo}>
              <div style={styles.heroTopRow}>
                <div>
                  <p style={styles.eyebrow}>Temple Organizer</p>
                  <h1 style={styles.name}>{profile?.username || "Organizer Name"}</h1>
                  <p style={styles.email}>{profile?.email || "organizer@example.com"}</p>
                </div>
                <button style={styles.editButton} onClick={() => setIsEditing((value) => !value)}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaPill}>Joined {new Date(profile?.createdAt || Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span style={styles.metaPill}>Role: Organizer</span>
              </div>
            </div>
          </div>
        </section>

        {message ? <div style={styles.message}>{message}</div> : null}

        <div style={styles.grid}>
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelEyebrow}>Profile</p>
                <h2 style={styles.panelTitle}>Account Information</h2>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.username}
                  placeholder="Organiz er Name"
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={{ ...styles.input, background: "#f8fafc" }}
                  type="email"
                  value={profile?.email || ""}
                  placeholder="Email address"
                  readOnly
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="tel"
                  value={formData.phone}
                  placeholder="Phone number"
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.profileImage}
                  placeholder="Profile photo URL (optional)"
                  onChange={(e) => setFormData((prev) => ({ ...prev, profileImage: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div style={styles.infoRow}>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Temple Name</span>
                  <strong style={styles.infoValue}>{profile?.templeName || "Temple not assigned"}</strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Temple Location</span>
                  <strong style={styles.infoValue}>{profile?.templeLocation || "Location not updated"}</strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Account Status</span>
                  <strong style={styles.infoValue}>Active</strong>
                </div>
              </div>

              {isEditing ? (
                <button style={styles.primaryButton} type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
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

            <form onSubmit={handlePasswordUpdate} style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="password"
                  value={passwordForm.currentPassword}
                  placeholder="Current password"
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="password"
                  value={passwordForm.newPassword}
                  placeholder="New password"
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="password"
                  value={passwordForm.confirmPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              <button style={styles.secondaryButton} type="submit" disabled={passwordSaving}>
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>
        </div>

        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Temples Managed</span>
            <strong style={styles.statValue}>{stats.templeCount}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Darshans</span>
            <strong style={styles.statValue}>{stats.darshanCount}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Bookings</span>
            <strong style={styles.statValue}>{stats.bookingCount}</strong>
          </div>
          <div style={styles.statCardGold}>
            <span style={styles.statLabel}>Revenue</span>
            <strong style={styles.statValue}>₹{stats.revenue}</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Active Slots</span>
            <strong style={styles.statValue}>{stats.activeDarshanSlots}</strong>
          </div>
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
  shell: {
    width: "min(1200px, 92%)",
    margin: "24px auto 0",
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
  avatarImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
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
    background: "#ecfeff",
    color: "#0f766e",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(15, 118, 110, 0.16)",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.9fr",
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
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
  },
  statCardGold: {
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    color: "white",
    padding: "18px 20px",
    borderRadius: "18px",
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  },
  statValue: {
    fontSize: "28px",
    color: "#0f172a",
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

export default OrganizerProfile;
