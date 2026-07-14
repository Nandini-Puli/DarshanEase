import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Donate() {
  const { templeId } = useParams();
  const navigate = useNavigate();

  const [temple, setTemple] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/temples/${templeId}`)
      .then(({ data }) => {
        setTemple(data?.temple || data);
      })
      .catch(() => {
        setMessage("Temple not found.");
      });
  }, [templeId]);

  const donate = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/donations", {
        templeId,
        amount: Number(amount),
        paymentMethod,
      });

      navigate("/donations", {
        state: {
          message: data.message,
        },
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Donation failed.");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 250, 500, 1000, 5000];
  const platformFee = Number(amount || 0) * 0.02;
  const total = Number(amount || 0) + platformFee;
  const methodCards = [
    { key: "UPI", label: "UPI" },
    { key: "Credit Card", label: "Credit Card" },
    { key: "Debit Card", label: "Debit Card" },
    { key: "Net Banking", label: "Net Banking" },
    { key: "Wallet", label: "Wallet" },
  ];

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.heroCard}>
          <div style={styles.coverWrap}>
            <div style={styles.coverGlow} />
            <div style={styles.logoCircle}>{temple?.templeName ? temple.templeName.charAt(0) : "T"}</div>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{temple?.templeName || "Temple of Devotion"}</h1>
            <p style={styles.heroSubtitle}>Support your favourite temple with a secure contribution.</p>
          </div>
        </div>

        <form onSubmit={donate} style={styles.card}>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.eyebrow}>Donation</p>
                <h2 style={styles.sectionTitle}>Make a contribution</h2>
              </div>
              <div style={styles.badge}>Secure</div>
            </div>

            <label style={styles.label}>Donation Amount</label>
            <div style={styles.inputWrap}>
              <span style={styles.currency}>₹</span>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={styles.input}
              />
            </div>

            <div style={styles.quickRow}>
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  style={styles.quickButton}
                  onClick={() => setAmount(String(value))}
                >
                  ₹{value}
                </button>
              ))}
            </div>
          </section>

          <section style={styles.section}>
            <label style={styles.label}>Payment Method</label>
            <div style={styles.methodGrid}>
              {methodCards.map((method) => (
                <button
                  key={method.key}
                  type="button"
                  onClick={() => setPaymentMethod(method.key)}
                  style={{
                    ...styles.methodCard,
                    ...(paymentMethod === method.key ? styles.methodCardActive : {}),
                  }}
                >
                  <span style={styles.methodIcon}>{method.label.charAt(0)}</span>
                  <span style={styles.methodText}>{method.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={styles.summaryCard}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Temple</span>
              <strong style={styles.summaryValue}>{temple?.templeName || "Temple"}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Donation</span>
              <strong style={styles.summaryValue}>₹{Number(amount || 0)}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Platform Fee</span>
              <strong style={styles.summaryValue}>₹{platformFee.toFixed(2)}</strong>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: "1px solid #f1e7d8", paddingTop: "12px", marginTop: "6px" }}>
              <span style={styles.summaryLabel}>Total</span>
              <strong style={styles.totalValue}>₹{total.toFixed(2)}</strong>
            </div>
          </section>

          {message && <p style={styles.error}>{message}</p>}

          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? "Processing..." : "Donate Securely"}
          </button>

          <div style={styles.footerNote}>
            <span style={styles.lockIcon}>🔒</span>
            <span>Safe & Secure Payment</span>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "28px 20px 40px",
    background: "linear-gradient(135deg, #fff8e1 0%, #f5efe2 100%)",
    fontFamily: "Inter, Arial, sans-serif",
  },
  heroCard: {
    width: "min(920px, 100%)",
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
    overflow: "hidden",
    marginBottom: "20px",
  },
  coverWrap: {
    height: "180px",
    background: "linear-gradient(135deg, #0f766e 0%, #f59e0b 100%)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  coverGlow: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at top left, rgba(255,255,255,0.3), transparent 55%)",
  },
  logoCircle: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    background: "white",
    color: "#0f766e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "800",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.16)",
    position: "relative",
    zIndex: 1,
  },
  heroContent: {
    padding: "26px 24px 24px",
    textAlign: "center",
  },
  heroTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },
  heroSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },
  card: {
    width: "min(920px, 100%)",
    display: "grid",
    gap: "18px",
    padding: "28px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.96)",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(221, 170, 95, 0.2)",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: "0 0 4px",
    color: "#b45309",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
  },
  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },
  badge: {
    background: "#ecfeff",
    color: "#0f766e",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    padding: "0 14px",
    background: "#fff",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.03)",
  },
  currency: {
    color: "#0f766e",
    fontSize: "20px",
    fontWeight: "700",
    marginRight: "8px",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "14px 0",
    fontSize: "16px",
    background: "transparent",
  },
  quickRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  quickButton: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#0f172a",
    borderRadius: "999px",
    padding: "9px 14px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  methodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
  },
  methodCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "12px 14px",
    background: "#fcfbf8",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  methodCardActive: {
    borderColor: "#0f766e",
    background: "#f0fdfa",
    boxShadow: "0 10px 24px rgba(15, 118, 110, 0.12)",
  },
  methodIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f766e, #f59e0b)",
    color: "white",
    fontWeight: "700",
    flexShrink: 0,
  },
  methodText: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "14px",
  },
  summaryCard: {
    background: "linear-gradient(135deg, #fcfbf8 0%, #fff7e6 100%)",
    borderRadius: "18px",
    padding: "16px",
    border: "1px solid #f1e7d8",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: "14px",
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: "14px",
  },
  totalValue: {
    color: "#0f766e",
    fontSize: "16px",
    fontWeight: "800",
  },
  error: {
    color: "#b42318",
    fontWeight: "600",
    marginTop: "-4px",
  },
  submitButton: {
    border: "none",
    background: "linear-gradient(135deg, #0f766e, #0d9488)",
    color: "white",
    padding: "14px 18px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(15, 118, 110, 0.24)",
  },
  footerNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#0f766e",
    fontWeight: "700",
    fontSize: "14px",
  },
  lockIcon: {
    fontSize: "16px",
  },
};

export default Donate;