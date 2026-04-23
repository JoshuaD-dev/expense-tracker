import { useState, useEffect } from "react";
import api from "./api";

function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.log("Session expired or not logged in");
      setExpenses([]);
    }
  }

  async function addExpense() {
    if (!title || !amount) {
      setError("Please fill in both fields");
      return;
    }
    try {
      const res = await api.post("/expenses", {
        title,
        amount: parseFloat(amount),
      });
      setExpenses([res.data, ...expenses]);
      setTitle("");
      setAmount("");
      setError("");
    } catch (err) {
      setError("Failed to add expense");
    }
  }

  async function deleteExpense(id) {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      setError("Failed to delete expense");
    }
  }

  async function handleLogout() {
    await api.post("/logout");
    onLogout();
  }

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>💰 ExpenseTracker</h1>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>Hi, {user.username}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Total Card */}
        <div style={styles.totalCard}>
          <p style={styles.totalLabel}>Total Spent</p>
          <p style={styles.totalAmount}>₹{total.toFixed(2)}</p>
        </div>

        {/* Add Expense */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add New Expense</h3>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              style={{ ...styles.input, width: "140px" }}
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button style={styles.addBtn} onClick={addExpense}>
              + Add
            </button>
          </div>
        </div>

        {/* Expense List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Expenses</h3>
          {expenses.length === 0 ? (
            <p style={styles.empty}>No expenses yet. Add one above!</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} style={styles.expenseItem}>
                <div>
                  <p style={styles.expenseTitle}>{expense.title}</p>
                </div>
                <div style={styles.expenseRight}>
                  <span style={styles.expenseAmount}>
                    ₹{parseFloat(expense.amount).toFixed(2)}
                  </span>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f2f5" },
  header: {
    backgroundColor: "#6c63ff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { margin: 0, color: "white", fontSize: "1.5rem" },
  headerRight: { display: "flex", alignItems: "center", gap: "1rem" },
  welcome: { color: "white", fontSize: "14px" },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#6c63ff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  content: { maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" },
  totalCard: {
    backgroundColor: "#6c63ff",
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  totalLabel: { color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "14px" },
  totalAmount: { color: "white", fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0 0" },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  cardTitle: { margin: "0 0 1rem", color: "#1a1a1a" },
  inputRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  input: {
    flex: 1,
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c63ff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  expenseItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  expenseTitle: { margin: 0, fontWeight: "500", color: "#1a1a1a" },
  expenseRight: { display: "flex", alignItems: "center", gap: "1rem" },
  expenseAmount: { fontWeight: "bold", color: "#6c63ff", fontSize: "16px" },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  error: { color: "red", fontSize: "13px" },
  empty: { color: "#888", textAlign: "center", padding: "2rem 0" },
};

export default Dashboard;