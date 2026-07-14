import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Logintemple from "../assets/images/backgrounds/Logintemple.jpg";

function OrganizeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/organizer/login", {
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("accountType", data.accountType || "organizer");
      localStorage.setItem("role", data.organizer.role);
      localStorage.setItem("username", data.organizer.username);
      localStorage.setItem(
        "organizer",
        JSON.stringify(data.organizer)
      );
      localStorage.setItem("isLoggedIn", "true");

      alert("Login Successful");

      navigate("/organizerhome");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
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

          <span style={styles.user}>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "white" }}
            >
              User
            </Link>
          </span>

          <h1 style={styles.heading}>
            Login to Organizer
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              style={styles.button}
            >
              Login
            </button>

          </form>

          <p style={styles.signup}>
            Don't have an account?{" "}
            <span style={styles.signupLink}>
              <Link
                to="/organizeregister"
                style={{
                  color: "#ff4d4d",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Register
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
  },

  card: {
    width: "700px",
    backgroundColor: "#007f5f",
    display: "flex",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,.3)",
    gap: "30px",
  },

  imageSection: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "8px",
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
    textAlign: "center",
    marginBottom: "25px",
  },

  user: {
    alignSelf: "flex-end",
    backgroundColor: "#ffb4a2",
    padding: "8px 18px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontWeight: "bold",
  },

  label: {
    color: "white",
    fontWeight: "bold",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "5px",
    border: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "140px",
    padding: "12px",
    backgroundColor: "#ffb4a2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  signup: {
    marginTop: "20px",
    color: "#ddd",
    fontSize: "15px",
  },

  signupLink: {
    fontWeight: "bold",
  },

};

export default OrganizeLogin;