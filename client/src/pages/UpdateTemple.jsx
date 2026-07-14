import { Link, useParams } from "react-router-dom";
import OrganizerNavbar from "../components/OrganizerNavbar";

function UpdateTemple() {
  const { id } = useParams();

  return (
    <>
    <OrganizerNavbar />
    <div style={styles.page}>

      <div style={styles.form}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Temple management</p>
            <h2 style={styles.title}>Update Temple</h2>
          </div>
          <Link to={`/mytemple/${id}`} style={styles.backLink}>
            Back
          </Link>
        </div>

        <label style={styles.label}>Temple Name</label>
        <input type="text" placeholder="Temple Name" style={styles.input} />

        <label style={styles.label}>Timings</label>
        <div style={styles.timelabel}>
          <span style={styles.timeLabelText}>Open</span>
          <span style={styles.timeLabelText}>Close</span>
        </div>

        <div style={styles.timeBox}>
          <input type="time" style={styles.time} />
          <input type="time" style={styles.time} />
        </div>

        <label style={styles.label}>Address</label>
        <input type="text" placeholder="Address" style={styles.input} />

        <label style={styles.label}>Description</label>
        <textarea placeholder="Description" style={styles.textarea} />

        <label style={styles.label}>Update Temple Image</label>
        <input type="file" style={styles.fileInput} />

        <button style={styles.button}>Update Temple</button>
      </div>
    </div>
    </>
  );
}

const styles = {
  page: {
  minHeight: "calc(100vh - 80px)",
  background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
  padding: "40px 20px",
  display: "flex",
  justifyContent: "center",
},
  form: {
  width: "100%",
  maxWidth: "700px",
  background: "#fff",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  marginTop: "20px",
},

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  eyebrow: {
    margin: "0 0 4px",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#b45309",
    fontWeight: "700",
    fontSize: "12px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },

  backLink: {
    color: "#0f766e",
    fontWeight: "700",
    textDecoration: "none",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    marginTop: "16px",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "4px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
    outline: "none",
  },

  timelabel: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "2px",
    color: "#4b5563",
    fontSize: "14px",
    fontWeight: "700",
  },

  timeLabelText: {
    flex: 1,
  },

  timeBox: {
    display: "flex",
    gap: "16px",
    marginBottom: "4px",
  },

  time: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none",
  },

  fileInput: {
    width: "100%",
    padding: "10px 0",
  },

  button: {
    marginTop: "24px",
    background: "linear-gradient(135deg, #d97706, #b45309)",
    color: "white",
    border: "none",
    padding: "13px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(217, 119, 6, 0.25)",
  },
};


export default UpdateTemple;