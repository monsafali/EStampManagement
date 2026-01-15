import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Outlet, useLocation } from "react-router-dom"


import GetVendor from "./AdcAdmin/GetVendor";
import CreateVendor from "./AdcAdmin/CreateVendor";
import CreateBankUser from "./AdcAdmin/CreateBankUser";

import "../styles/pages/ADCdashboard.css"
import "../styles/pages/dashboard.shared.css";

export default function ADCDashboard() {
  const { user} = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("vendors");
  const location = useLocation();





const isMonthlyReportOpen = location.pathname.includes("monthly-report");

  return (
    <div className="main-dashborad">
      {/* ACTION BUTTONS (AUTO HIDE) */}
      {!isMonthlyReportOpen && (
        <div className="dashboard-actions">
          <button
            className={`dashboard-btn   sliding-overlay-btn ${activeSection === "vendors" ? "form-btn" : ""}`}
            onClick={() => setActiveSection("vendors")}
          >

            Vendors List
          </button>

          <button
            className={`dashboard-btn   sliding-overlay-btn ${activeSection === "createVendor" ? "form-btn" : ""}`}
            onClick={() => setActiveSection("createVendor")}
          >
            Create Vendor
          </button>

          <button
            className={`dashboard-btn  sliding-overlay-btn ${activeSection === "bank" ? "form-btn" : ""}`}
            onClick={() => setActiveSection("bank")}
          >
            Create Bank User
          </button>
        </div>
      )}
      <div className="dashboard dashboard-wrapper container">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1>ADC Dashboard</h1>
          <p>Welcome {user?.username}</p>
        </div>


        {/* DASHBOARD CONTENT (AUTO CLOSE) */}
        {!isMonthlyReportOpen && activeSection === "vendors" && (
          <div className="dashboard-card">
            <GetVendor />
          </div>
        )}

        {!isMonthlyReportOpen && activeSection === "createVendor" && (
          <div className="dashboard-card">
            <h2>Create Vendor</h2>
            <CreateVendor
              districtId={user.districtId}
              districtName={user.district}
            />
          </div>
        )}

        {!isMonthlyReportOpen && activeSection === "bank" && (
          <div className="dashboard-card">
            <h2>Create Bank User</h2>
            <CreateBankUser />

          </div>
        )}

        {/* MONTHLY REPORT RENDERS HERE */}
        <Outlet />

      </div>
    </div>

  );
}
