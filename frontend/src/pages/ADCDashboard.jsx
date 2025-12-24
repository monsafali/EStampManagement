import { useContext, useEffect,useState } from "react";
import { AuthContext } from "../AuthContext";
import GetVendor from "./AdcAdmin/GetVendor";
import CreateVendor from "./AdcAdmin/CreateVendor";
import CreateBankUser from "./AdcAdmin/CreateBankUser";
import { Outlet } from "react-router-dom";
import "../styles/pages/ADCdashboard.css"
import "../styles/pages/dashboard.shared.css";

export default function ADCDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("vendors");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      {/* HEADER */}
   <div className="dashboard-header">
    <h1>ADC Dashboard</h1>
    <p>Welcome {user?.username}</p>
  </div>
      {/* ACTION BUTTONS */}
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

      {activeSection === "vendors" && (
        <div className="dashboard-card">
          <h2>Vendors List</h2>
          <GetVendor />
        </div>
      )}

      {activeSection === "createVendor" && (
        <div className="dashboard-card">
          {/* <h2>Create Vendor</h2> */}
          <CreateVendor
            districtId={user.districtId}
            districtName={user.district}
          />
        </div>
      )}

      {activeSection === "bank" && (
        <div className="dashboard-card">
          <h2>Create Bank User</h2>
          <CreateBankUser />
        </div>
      )}
      <Outlet />
    </div>
  );
}
