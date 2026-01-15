
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import CreateADCAdmin from './SuperAdmin/CreateADCAdmin';
import ManageADCAdmins from "./SuperAdmin/ManageADCAdmins";
import UploadRagForm from '../components/UploadRagForm';

import "../styles/pages/dashboard.shared.css";



export default function SuperAdminDashboard() {
  const { user } = useContext(AuthContext);
  
  // Track active section
  const [activeSection, setActiveSection] = useState("create"); // default create




  return (
    <div className="main-dashborad">
   
      <div className="dashboard-actions">
        <button
          className={`dashboard-btn sliding-overlay-btn ${activeSection === "create" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("create")}
        >
          Create ADC Admin
        </button>

        <button
          className={`dashboard-btn sliding-overlay-btn ${activeSection === "manage" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("manage")}
        >
          View / Manage ADC Admins
        </button>
        <button
          className={`dashboard-btn sliding-overlay-btn ${activeSection === "upload" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("upload")}
        >
          Upload RAG
        </button>
      </div>
      <div className="dashboard dashboard-wrapper container">
        <div className="dashboard-header">
          <h1>Super Admin Dashboard</h1>
          <p>Welcome {user?.username}</p>
        </div>
        {/* CONDITIONALLY RENDER */}
        {activeSection === "create" && (
          <div className="dashboard-card">
            <h2>Create ADC Admin</h2>
            <CreateADCAdmin />
          </div>
        )}

        {activeSection === "manage" && (
          <div className="dashboard-card">
            <h2>Manage ADC Admins</h2>
            <ManageADCAdmins />
          </div>
        )}
        {activeSection === "upload" && (
          <div className="dashboard-card">
            <h2>Upload RAG Files</h2>
            <UploadRagForm />
          </div>
        )}
      </div>
    </div>

  );
}



