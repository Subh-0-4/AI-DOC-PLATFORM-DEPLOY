import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("user1@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      formData.append("grant_type", "password"); // REQUIRED for OAuth2PasswordRequestForm

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = res.data.access_token;

      if (!token) {
        setError("Invalid token received");
        return;
      }

      // Save token + notify App.js
      onLogin(token);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Check your email/password.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(15,23,42,0.6)",
          padding: "28px 24px 24px",
        }}
      >
        <h2 style={{ marginBottom: "8px" }}>Welcome back</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
          Sign in to continue creating AI-powered documents.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <label style={{ display: "block", fontSize: "0.85rem" }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                outline: "none",
              }}
              required
            />
          </label>

          <label
            style={{
              display: "block",
              fontSize: "0.85rem",
              marginTop: "12px",
            }}
          >
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                outline: "none",
              }}
              required
            />
          </label>

          {error && (
            <div
              style={{
                marginTop: "10px",
                color: "#b91c1c",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: "18px",
              width: "100%",
              padding: "10px",
              background:
                "linear-gradient(to right,#2563eb,#4f46e5,#7c3aed)",
              color: "white",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.03em",
            }}
          >
            Sign in
          </button>
        </form>

        <p
          style={{
            marginTop: "14px",
            fontSize: "0.85rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "#2563eb" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
