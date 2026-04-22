import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
    setShowLogin(true);
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (showLogin) {
    return (
      <Login
        onLogin={handleLogin}
        onSwitch={() => setShowLogin(false)}
      />
    );
  }

  return (
    <Register
      onLogin={handleLogin}
      onSwitch={() => setShowLogin(true)}
    />
  );
}

export default App;