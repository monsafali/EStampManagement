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
      <h3 className="upload-rag-title">Upload RAG Document</h3>

      <form onSubmit={submit} className="upload-rag-form">
        {/* File Input */}
        <div>
          <label
            htmlFor="file"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Select file
          </label>
          <input
            id="file"
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-700
                       file:mr-4 file:rounded-md file:border-0
                       file:bg-gray-100 file:px-4 file:py-2
                       file:text-sm file:font-medium
                       hover:file:bg-gray-200"
          />
          {file && (
            <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-lg bg-red-500 px-4 py-2 text-white font-medium
                     hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Status */}
      {status && <div className="mt-4 text-sm text-gray-700">{status}</div>}
    </div>
  );
}
