const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: ["http://localhost:5173", "https://expense-tracker-one-mauve-56.vercel.app"],
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username=$1", [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );
    req.session.user = result.rows[0];
    req.session.save((err) => {
      if (err) return res.status(500).json({ error: "Session error" });
      res.status(201).json(result.rows[0]);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1", [username]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    req.session.user = { id: user.id, username: user.username };
    req.session.save((err) => {
      if (err) return res.status(500).json({ error: "Session error" });
      res.json({ id: user.id, username: user.username });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// Get current user
app.get("/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

// Get all expenses
app.get("/expenses", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id=$1 ORDER BY id DESC",
      [req.session.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add expense
app.post("/expenses", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const { title, amount } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, amount, req.session.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
app.delete("/expenses/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM expenses WHERE id=$1 AND user_id=$2",
      [id, req.session.user.id]
    );
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});