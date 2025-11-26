// src/components/CommentBox.js
import React, { useState } from "react";

function CommentBox({ comments, onAddComment }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText("");
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Comments</div>
      <div
        style={{
          maxHeight: "120px",
          overflowY: "auto",
          background: "#f9fafb",
          padding: "8px",
          borderRadius: "8px",
          marginTop: "4px",
          fontSize: "0.85rem",
        }}
      >
        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              style={{
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "4px",
                marginBottom: "4px",
              }}
            >
              {c.text}
            </div>
          ))
        ) : (
          <div style={{ color: "#9ca3af" }}>No comments yet.</div>
        )}
      </div>
      <div style={{ display: "flex", marginTop: "6px", gap: "6px" }}>
        <input
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default CommentBox;
