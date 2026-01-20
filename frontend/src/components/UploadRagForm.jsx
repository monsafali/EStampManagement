import React, { useState } from "react";
import "../styles/pages/SuperAdmin/uploadRagForm.css"


import { API_BASE_URL } from "../api";

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
      const res = await API_BASE_URL.post("/api/uploadrag", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Upload failed");
      }

      setStatus("File uploaded successfully");
      setFile(null);
    } catch (err) {
      setStatus(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="upload-rag-card">
      <form onSubmit={submit} className="form-container">
        {/* File Input */}
        <div className="input-group">
          <div className="form-group col-70">
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
          <div className="form-group col-30">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="form-btn sliding-overlay-btn"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

        </div>

      </form>
      {/* Status */}
      {status && <div className="status-text">{status}</div>}
    </div>
  );
}
