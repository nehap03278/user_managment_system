import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./styles.css";

function App() {
  //  direct init from localStorage (no extra render)
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(true);

  // =====================
  // LOGIN
  // =====================
  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // =====================
  // LOGOUT
  // =====================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowLogin(true); // always go back to login screen
  };

  // =====================
  // ROUTING
  // =====================
  if (token) {
    return (
      <Dashboard
        key={token} //  forces clean reload after login/logout
        token={token}
        logout={handleLogout}
      />
    );
  }

  return showLogin ? (
    <Login setToken={handleSetToken} setShowLogin={setShowLogin} />
  ) : (
    <Register setShowLogin={setShowLogin} />
  );
}

export default App;