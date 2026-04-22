import { useState } from "react";
import api from "./api";

function Register({ onSwitch, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post("/register", { username, password });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Start tracking your expenses</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>
        <p style={styles.switchText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={onSwitch}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: { margin: 0, fontSize: "1.8rem", color: "#1a1a1a" },
  sub: { margin: 0, color: "#888", fontSize: "14px" },
  input: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: { color: "red", fontSize: "13px", margin: 0 },
  switchText: { textAlign: "center", fontSize: "14px", color: "#888" },
  link: { color: "#6c63ff", cursor: "pointer", fontWeight: "bold" },
};

export default Register;