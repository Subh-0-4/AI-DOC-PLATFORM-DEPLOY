// src/components/SectionCard.js
import React, { useState } from "react";
import CommentBox from "./CommentBox";

function SectionCard({ section, onRefine, onFeedback, onAddComment }) {
  const [prompt, setPrompt] = useState("");
  const [refining, setRefining] = useState(false);

  const handleRefineClick = async () => {
    if (!prompt.trim()) return;
    setRefining(true);
    await onRefine(section.id, prompt.trim());
    setPrompt("");
    setRefining(false);
  };

  const handleLike = () => onFeedback(section.id, true);
  const handleDislike = () => onFeedback(section.id, false);

  return (
    <div
      style={{
        padding: "14px",
        background: "white",
        borderRadius: "14px",
        boxShadow: "0 10px 25px -12px rgba(15,23,42,0.5)",
        marginBottom: "14px",
      }}
    >
      <h3 style={{ margin: 0 }}>{section.title}</h3>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f9fafb",
          padding: "8px",
          borderRadius: "8px",
          marginTop: "8px",
          fontSize: "0.9rem",
        }}
      >
        {section.content || "(No content yet)"}
      </pre>

      <div style={{ marginTop: "8px" }}>
        <label style={{ fontSize: "0.85rem" }}>
          Refinement prompt
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            placeholder="e.g., Make it more concise and formal"
          />
        </label>
        <button
          onClick={handleRefineClick}
          disabled={refining}
          style={{
            marginTop: "6px",
            padding: "6px 12px",
            borderRadius: "999px",
            border: "none",
            background: "#4f46e5",
            color: "white",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          {refining ? "Refining..." : "Refine with AI"}
        </button>
      </div>

      <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
        <button
          onClick={handleLike}
          style={{
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid #10b981",
            background: "#ecfdf5",
            color: "#047857",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          👍 Like
        </button>
        <button
          onClick={handleDislike}
          style={{
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid #f97316",
            background: "#fff7ed",
            color: "#c2410c",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          👎 Dislike
        </button>
      </div>

      <CommentBox
        comments={section.comments || []}
        onAddComment={(text) => onAddComment(section.id, text)}
      />
    </div>
  );
}

export default SectionCard;
