import { Link } from "react-router-dom";

function UserTable({
  users,
  onDelete,
}) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Sl No</th>
          <th style={styles.th}>Username</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Phone</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr key={user._id}>
              <td style={styles.td}>
                {index + 1}
              </td>

              <td style={styles.td}>
                {user.username}
              </td>

              <td style={styles.td}>
                {user.email}
              </td>

              <td style={styles.td}>
                {user.phone}
              </td>

              <td style={styles.td}>
                <Link to={`/users/${user._id}`}>
                  <button style={styles.viewBtn}>
                    View
                  </button>
                </Link>

                <button
                  style={styles.deleteBtn}
                  onClick={() => onDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              No Users Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#fff",
  },

  th: {
    backgroundColor: "#008080",
    color: "#fff",
    padding: "12px",
    border: "1px solid #ddd",
  },

  td: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
  },

  viewBtn: {
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },

  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UserTable;