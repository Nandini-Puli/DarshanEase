import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Logintemple from "../assets/images/backgrounds/Logintemple.jpg";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("accountType", data.accountType);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.back}></div>

      <div style={styles.card}>
        <div style={styles.imageSection}>
          <img
            src={Logintemple}
            alt="Temple"
            style={styles.image}
          />
        </div>

        <div style={styles.formSection}>
          <h1 style={styles.heading}>
            Create User Account
            <br />
            in DarshanEase
          </h1>

          <form onSubmit={handleRegister}>
            <label style={styles.label}>
              Username
            </label>

            <input
              type="text"
              placeholder="Enter Username"
              style={styles.input}
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Email Address"
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
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="submit"
              style={styles.button}
            >
              Sign Up
            </button>
          </form>

          <p style={styles.signup}>
            Already have an account?{" "}
            <span style={styles.signupLink}>
              <Link to="/login">
                Sign In
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

  back: {
    position: "absolute",
    top: "50px",
    left: "80px",
    fontSize: "35px",
    color: "gray",
    cursor: "pointer",
  },

  card: {
    width: "620px",
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
    height: "430px",
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
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
  },

  signup: {
    marginTop: "18px",
    color: "#bdbdbd",
    fontSize: "16px",
  },

  signupLink: {
    color: "#ff4d4d",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Register;