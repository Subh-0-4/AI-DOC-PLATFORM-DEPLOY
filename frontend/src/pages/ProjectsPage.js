// src/pages/ProjectsPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("docx");
  const [mainTopic, setMainTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        name,
        document_type: documentType,
        main_topic: mainTopic,
        sections: [
          {
            order_index: 0,
            title: "Introduction",
            content: "This is the introduction section of your document.",
          },
          {
            order_index: 1,
            title: "Main Content",
            content: "This section contains the main explanation about your chosen topic.",
          },
          {
            order_index: 2,
            title: "Conclusion",
            content: "This section summarizes the most important points.",
          },
        ],
      };

      await api.post("/projects/", body);
      setName("");
      setMainTopic("");
      await fetchProjects();
    } catch (err) {
      console.error("Error creating project", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ color: "white" }}>Your Projects</h2>
        <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
          AI-generated Word & PowerPoint documents
        </span>
      </div>

      <form
        onSubmit={handleCreate}
        style={{
          marginTop: "8px",
          padding: "18px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -15px rgba(15,23,42,0.6)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Create new project</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <label style={{ fontSize: "0.85rem" }}>
            Project name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
          </label>

          <label style={{ fontSize: "0.85rem" }}>
            Main topic
            <input
              value={mainTopic}
              onChange={(e) => setMainTopic(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
          </label>

          <label style={{ fontSize: "0.85rem" }}>
            Document type
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <option value="docx">Word (.docx)</option>
              <option value="pptx">PowerPoint (.pptx)</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "14px",
            padding: "9px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(to right,#2563eb,#4f46e5,#7c3aed)",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : "Create project"}
        </button>
      </form>

      <div style={{ marginTop: "24px" }}>
        {projects.length === 0 ? (
          <p style={{ color: "#e5e7eb" }}>No projects yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "14px",
            }}
          >
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "14px",
                    background: "white",
                    borderRadius: "14px",
                    boxShadow: "0 10px 25px -12px rgba(15,23,42,0.5)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      {p.document_type.toUpperCase()} · {p.main_topic}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "0.8rem",
                      color: "#2563eb",
                    }}
                  >
                    Open project →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
