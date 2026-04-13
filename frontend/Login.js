import { useState } from "react";
import { loginUser } from "./api";

export default function Login({ setToken, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoading(true);

    const res = await loginUser({ email, password });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setToken(res.access_token);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="container">

      {/* HEADER */}
      <h1 style={{ textAlign: "center" }}>
        User Management System
      </h1>

      <div className="card">
        <h2>Login</h2>

        {/* ERROR MESSAGE */}
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <input
  name="email"
  placeholder="Email"
  autoComplete="new-email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  name="password"
  type="password"
  placeholder="Password"
  autoComplete="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={() => setShowLogin(false)}
          style={{
            cursor: "pointer",
            color: "#2563eb",
            marginTop: "10px",
          }}
        >
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}