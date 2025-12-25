import React, { useState } from "react";
import "../styles/pages/SuperAdmin/uploadRagForm.css"



const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function UploadRagForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    setLoading(true);
    setStatus("Uploading...");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/uploadrag`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Upload failed");
      }

      setStatus("File uploaded successfully ");
      setFile(null);
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-rag-card">
      <form onSubmit={submit} className="form-container">
        {/* File Input */}
        <div className="form-group">

          <input
            id="file"
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label
            htmlFor="file"
          >
            Select file
          </label>
          {file && (
            <p className="file-name">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="form-btn"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {/* Status */}
      {status && <div className="status-text">{status}</div>}
    </div>
  );
}
