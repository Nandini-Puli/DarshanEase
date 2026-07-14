function DashboardCard({
  title,
  count,
  color = "#008080",
}) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: "25px",
        borderRadius: "10px",
        width: "220px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h2>{count}</h2>

      <h4>{title}</h4>
    </div>
  );
}

export default DashboardCard;