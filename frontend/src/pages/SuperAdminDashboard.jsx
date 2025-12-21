
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import CreateADCAdmin from './SuperAdmin/CreateADCAdmin';
import ManageADCAdmins from "./SuperAdmin/ManageADCAdmins";
import UploadRagForm from '../components/UploadRagForm';
import "../styles/pages/SuperAdmin/SuperAdminDashboard.css";




export default function SuperAdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  // Track active section
  const [activeSection, setActiveSection] = useState("create"); // default create

  if (loading) return <p>Loading...</p>;

  return (
    <div className="sa-dashboard">
      <div className="sa-header">
        <h1>Super Admin Dashboard</h1>
        <p>Welcome {user?.username}</p>
      </div>
      {/* UTILITIES */}
      {/* <section className="sa-utilities">
        <UploadRagForm />
      </section> */}
      <div className="sa-actions">
        <button
          className={`sa-btn outline ${activeSection === "create" ? "active" : ""}`}
          onClick={() => setActiveSection("create")}
        >
          Create ADC Admin
        </button>

        <button
          className={`sa-btn outline ${activeSection === "manage" ? "active" : ""}`}
          onClick={() => setActiveSection("manage")}
        >
          View / Manage ADC Admins
        </button>
        <button
          className={`sa-btn outline ${activeSection === "upload" ? "active" : ""}`}
          onClick={() => setActiveSection("upload")}
        >
          Upload RAG
        </button>
      </div>
      {/* CONDITIONALLY RENDER */}
      {activeSection === "create" && (
        <div className="sa-card">
          {/* <h2>Create ADC Admin</h2> */}
          <CreateADCAdmin />
        </div>
      )}

      {activeSection === "manage" && (
        <div className="sa-card">
          <h2>Manage ADC Admins</h2>
          <ManageADCAdmins />
        </div>
      )}
      {activeSection === "upload" && (
        <div className="sa-card">
          <h2>Upload RAG Files</h2>
          <UploadRagForm />
        </div>
      )}
    </div>
  );
}



