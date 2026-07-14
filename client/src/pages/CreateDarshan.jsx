import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerNavbar from "../components/OrganizerNavbar";
import Loader from "../components/Loader";
import { createDarshan } from "../services/darshanService";

function CreateDarshan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    templeId: localStorage.getItem("templeId") || "",
    darshanName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    availableSeats: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.darshanName ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.availableSeats ||
      !formData.price
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await createDarshan(formData);

      alert(res.message || "Darshan created successfully.");

      navigate("/darshans");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Unable to create Darshan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OrganizerNavbar />

      <div style={styles.page}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.header}>
            <p style={styles.eyebrow}>Darshan setup</p>
            <h2 style={styles.heading}>Create Darshan</h2>
            <p style={styles.subtitle}>Add a new sacred slot for your devotees.</p>
          </div>

          <label style={styles.label}>Darshan Name</label>
          <input
            type="text"
            name="darshanName"
            value={formData.darshanName}
            onChange={handleChange}
            placeholder="Enter Darshan Name"
            style={styles.input}
          />

          <label style={styles.label}>Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Description"
            style={styles.textarea}
          />

          <label style={styles.label}>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.row}>
            <div style={styles.column}>
              <label style={styles.label}>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.column}>
              <label style={styles.label}>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.column}>
              <label style={styles.label}>Available Seats</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                placeholder="100"
                style={styles.input}
              />
            </div>

            <div style={styles.column}>
              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="300"
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <Loader /> : "Create Darshan"}
          </button>
        </form>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 16px",
  },

  form: {
    width: "100%",
    maxWidth: "620px",
    background: "rgba(255,255,255,0.96)",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },

  header: {
    marginBottom: "16px",
  },

  eyebrow: {
    margin: "0 0 6px",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#b45309",
    fontWeight: "700",
    fontSize: "12px",
  },

  heading: {
    color: "#0f172a",
    margin: "0 0 6px",
    fontSize: "28px",
  },

  subtitle: {
    color: "#64748b",
    margin: 0,
  },

  label: {
    display: "block",
    color: "#374151",
    marginBottom: "8px",
    marginTop: "16px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none",
  },

  row: {
    display: "flex",
    gap: "16px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  column: {
    flex: "1 1 240px",
  },

  button: {
    width: "100%",
    marginTop: "24px",
    padding: "13px 16px",
    background: "linear-gradient(135deg, #d97706, #b45309)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 10px 24px rgba(217, 119, 6, 0.25)",
  },
};

export default CreateDarshan;