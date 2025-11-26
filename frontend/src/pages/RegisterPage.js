// frontend/src/pages/RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      // after successful registration, go to login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try a different email or check the backend.");
    } finally {
      setLoading(false);
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
        <h2 style={{ marginBottom: "8px" }}>Create your account</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
          Sign up to start generating AI-powered documents.
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
            disabled={loading}
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
            {loading ? "Creating account..." : "Sign up"}
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
