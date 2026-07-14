import { Link } from "react-router-dom";

function OrganizerTable({
  organizers,
  onDelete,
}) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Username</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Action</th>
        </tr>
      </thead>

      <tbody>
        {organizers.map((organizer, index) => (
          <tr key={organizer._id}>
            <td style={styles.td}>
              {index + 1}
            </td>

            <td style={styles.td}>
              {organizer.username}
            </td>

            <td style={styles.td}>
              {organizer.email}
            </td>

            <td style={styles.td}>
              <Link
                to={`/organizers/${organizer._id}`}
              >
                <button style={styles.viewBtn}>
                  View
                </button>
              </Link>

              <button
                style={styles.deleteBtn}
                onClick={() =>
                  onDelete(organizer._id)
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  th: {
    background: "#008080",
    color: "#fff",
    padding: "12px",
  },

  td: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "center",
  },

  viewBtn: {
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },

  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default OrganizerTable;