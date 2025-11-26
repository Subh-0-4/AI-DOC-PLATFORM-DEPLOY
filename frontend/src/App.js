// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import RefinePage from "./pages/RefinePage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  const handleLogin = (newToken) => {
    // store token for axios interceptor + reloads
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/projects");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
      }}
    >
      <header
        style={{
          padding: "12px 32px",
          background: "rgba(15,23,42,0.9)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1e293b",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
          AI DOC PLATFORM
        </div>
        {token && (
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              background: "#ef4444",
              border: "none",
              borderRadius: "999px",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </header>

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Navigate to={token ? "/projects" : "/login"} replace />}
          />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/refine" element={<RefinePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
