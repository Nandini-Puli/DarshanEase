import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Logintemple from "../assets/images/backgrounds/Logintemple.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountType = localStorage.getItem("accountType");

    if (token) {
      if (accountType === "organizer") {
        navigate("/organizer-dashboard");
      } else if (accountType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "role",
        data.user.role
      );

      localStorage.setItem(
        "username",
        data.user.username
      );

      localStorage.setItem(
        "accountType",
        data.user.role
      );
      localStorage.setItem("isLoggedIn", "true");
      alert("Login Successful");

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      }
      else if (data.user.role === "organizer") {
        navigate("/organizerhome");
      }
      else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.imageSection}>
          <img
            src={Logintemple}
            alt="Temple"
            style={styles.image}
          />
        </div>

        <div style={styles.formSection}>
          <span style={styles.organize}>
            <Link
              to="/organizelogin"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Organizer
            </Link>
          </span>

          <h1 style={styles.heading}>
            Login to User
            <br />
            Account
          </h1>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              style={styles.input}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              style={styles.input}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p style={styles.signup}>
            Don't have an account?{" "}
            <span style={styles.signupLink}>
              <Link
                to="/register"
                style={{
                  color: "#ff4d4d",
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  organize: {
    width: "100px",
    textAlign: "center",
    backgroundColor: "#ffb4a2",
    padding: "8px",
    borderRadius: "5px",
    marginLeft: "200px",
    marginBottom: "15px",
  },

  card: {
    width: "650px",
    backgroundColor: "#007f5f",
    display: "flex",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    gap: "25px",
  },

  imageSection: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: "390px",
    objectFit: "cover",
    borderRadius: "5px",
  },

  formSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heading: {
    color: "#001d3d",
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },

  label: {
    color: "#d9d9d9",
    marginBottom: "8px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    marginBottom: "18px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  button: {
    width: "120px",
    padding: "12px",
    backgroundColor: "#ffb4a2",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    marginTop: "10px",
  },

  signup: {
    marginTop: "18px",
    color: "#bdbdbd",
    fontSize: "16px",
  },

  signupLink: {
    fontWeight: "bold",
  },
};

export default Login;