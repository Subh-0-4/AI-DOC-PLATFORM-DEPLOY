// src/pages/ProjectDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import SectionCard from "../components/SectionCard";

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const res = await axiosClient.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRefine = async (sectionId, prompt) => {
    try {
      await axiosClient.post(`/sections/${sectionId}/refine`, { prompt });
      await fetchProject();
    } catch (err) {
      console.error("Refine error", err);
    }
  };

  const handleFeedback = async (sectionId, isLike) => {
    try {
      await axiosClient.post(`/sections/${sectionId}/feedback`, {
        is_like: isLike,
      });
    } catch (err) {
      console.error("Feedback error", err);
    }
  };

  const handleAddComment = async (sectionId, text) => {
    try {
      await axiosClient.post(`/sections/${sectionId}/comments`, { text });
      await fetchProject();
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  const handleExportDocx = async () => {
    try {
      const res = await axiosClient.get(`/export/docx/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "project"}-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export error", err);
      alert("Failed to export DOCX");
    }
  };

  const handleExportPptx = async () => {
    try {
      const res = await axiosClient.get(`/export/pptx/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "project"}-${id}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PPTX export error", err);
      alert("Failed to export PPTX");
    }
  };

  if (loading) return <div style={{ color: "white" }}>Loading project...</div>;
  if (!project) return <div style={{ color: "white" }}>Project not found.</div>;

  return (
    <div>
      <h2 style={{ color: "white" }}>{project.name}</h2>
      <div style={{ color: "#9ca3af", marginBottom: "10px" }}>
        {project.document_type.toUpperCase()} · {project.main_topic}
      </div>

      <div style={{ marginBottom: "14px", display: "flex", gap: "8px" }}>
        <button
          onClick={handleExportDocx}
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Download DOCX
        </button>
        <button
          onClick={handleExportPptx}
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            border: "none",
            background: "#7c3aed",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Download PPTX
        </button>
      </div>

      <div style={{ marginTop: "12px" }}>
        {project.sections && project.sections.length > 0 ? (
          project.sections
            .sort((a, b) => a.order_index - b.order_index)
            .map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onRefine={handleRefine}
                onFeedback={handleFeedback}
                onAddComment={handleAddComment}
              />
            ))
        ) : (
          <p style={{ color: "#e5e7eb" }}>No sections for this project.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailPage;
