import React, { useState } from "react";
import api from "../api/axiosClient";

function RefinePage() {
  const [originalText, setOriginalText] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const [result, setResult] = useState("");

  async function handleRefine() {
    try {
      const res = await api.post("/generate/refine", {
        text: originalText,
        instruction: selectedInstruction,
      });

      // Final refined text
      setResult(res.data.refined_text || JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setResult("Error refining content.");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Refine Text</h2>

      <textarea
        placeholder="Enter content to refine..."
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
        style={{ width: "100%", height: "120px" }}
      ></textarea>

      <textarea
        placeholder="Enter refinement instruction..."
        value={selectedInstruction}
        onChange={(e) => setSelectedInstruction(e.target.value)}
        style={{ width: "100%", height: "80px", marginTop: "12px" }}
      ></textarea>

      <button
        onClick={handleRefine}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
        }}
      >
        Refine
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            background: "#f4f4f4",
            padding: "20px",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>Refined Output</h3>
          {result}
        </div>
      )}
    </div>
  );
}

export default RefinePage;
