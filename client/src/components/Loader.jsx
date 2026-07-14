function Loader() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>

      <h3>Loading...</h3>
    </div>
  );
}

const styles = {
  container: {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "6px solid #ddd",
    borderTop: "6px solid #008080",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Loader;