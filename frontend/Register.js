import { useState } from "react";
import { signupUser } from "./api";

export default function Register({ setShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    // validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const res = await signupUser({ name, email, password, role });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("User created successfully! Please login.");

      // clear fields
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

      //  auto redirect after 1.5 sec
      setTimeout(() => {
        setShowLogin(true);
      }, 1500);
    }
  };

  return (
    <div className="container">

      {/* HEADER */}
      <h1 style={{ textAlign: "center" }}>
        User Management System
      </h1>

      <div className="card">
        <h2>Register</h2>

        {/* ERROR */}
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {success}
          </p>
        )}

       <input
  name="name"
  placeholder="Name"
  autoComplete="off"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

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

        {/* ROLE */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          onClick={() => setShowLogin(true)}
          style={{
            cursor: "pointer",
            color: "#2563eb",
            marginTop: "10px",
          }}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}