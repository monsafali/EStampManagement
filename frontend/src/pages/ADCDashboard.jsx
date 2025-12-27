import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Outlet, useLocation } from "react-router-dom"

import GetVendor from "./AdcAdmin/GetVendor";
import CreateVendor from "./AdcAdmin/CreateVendor";
import CreateBankUser from "./AdcAdmin/CreateBankUser";

;
import "../styles/pages/ADCdashboard.css"
import "../styles/pages/dashboard.shared.css";

export default function ADCDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("vendors");
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  const isMonthlyReportOpen = location.pathname.includes("monthly-report");

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>ADC Dashboard</h1>
        <p>Welcome {user?.username}</p>
      </div>
      {/* ACTION BUTTONS (AUTO HIDE) */}
      {!isMonthlyReportOpen && (
        <div className="dashboard-actions">
          <button
            className={`dashboard-btn outline ${activeSection === "vendors" ? "active" : ""}`}
            onClick={() => setActiveSection("vendors")}
          >
            Vendors List
          </button>

          <button
            className={`dashboard-btn outline ${activeSection === "createVendor" ? "active" : ""}`}
            onClick={() => setActiveSection("createVendor")}
          >
            Create Vendor
          </button>

          <button
            className={`dashboard-btn outline ${activeSection === "bank" ? "active" : ""}`}
            onClick={() => setActiveSection("bank")}
          >
            Create Bank User
          </button>
        </div>
      )}

      {/* DASHBOARD CONTENT (AUTO CLOSE) */}
      {!isMonthlyReportOpen && activeSection === "vendors" && (
        <div className="dashboard-card">
          <GetVendor />
        </div>
      )}

      {!isMonthlyReportOpen && activeSection === "createVendor" && (
        <div className="dashboard-card">
          <CreateVendor
            districtId={user.districtId}
            districtName={user.district}
          />
        </div>
      )}

      {!isMonthlyReportOpen && activeSection === "bank" && (
        <div className="dashboard-card">
          <CreateBankUser />
        </div>
      )}

      {/* MONTHLY REPORT RENDERS HERE */}
      <Outlet />

    </div>
  );
}
