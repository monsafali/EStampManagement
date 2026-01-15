import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";

import { Outlet } from "react-router-dom";
import Stamp from "./Vendor/Stamp";
import GenerateChallan from './Vendor/GenerateChallan';
import GetAllStamp from "./Vendor/GetAllStamp";
import GetInventory from "./Vendor/GetInventory";
import SearchStamp from "./Vendor/SearchStamp";
import IssuedStamps from "./Vendor/IssuedStamps";
import "../styles/pages/dashboard.shared.css";



export default function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("stamp");


  return (
    <div className="main-dashborad">
      {/* ACTION BUTTONS */}
      <div className="dashboard-actions">
        <button
          className={`dashboard-btn sliding-overlay-btn  ${activeSection === "stamp" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("stamp")}
        >
          Issue Stamp
        </button>

        <button
          className={`dashboard-btn sliding-overlay-btn ${activeSection === "challan" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("challan")}
        >
          Generate Challan
        </button>

        <button
          className={`dashboard-btn sliding-overlay-btn ${activeSection === "inventory" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("inventory")}
        >
          Inventory
        </button>

        <button
          className={`dashboard-btn sliding-overlay-btn ${activeSection === "AllStamp" ? "form-btn" : ""}`}
          onClick={() => setActiveSection("AllStamp")}
        >

          AllStamp
        </button>
   
      </div>
      <div className="dashboard dashboard-wrapper container">

        {/* HEADER (same as others) */}
        <div className="dashboard-header">
          <h1>Vendor Dashboard</h1>
          <p>
            Welcome {user?.username} — Tehsil {user?.tehsil}
          </p>
        </div>

        {/* CONTENT CARDS */}
        {activeSection === "stamp" && (
          <div className="dashboard-card">
            <h2>Generate Stamp</h2>
            <Stamp />
          </div>
        )}
        {activeSection === "challan" && (
          <div className="dashboard-card">
            <h2>Generate Challan</h2>
            <GenerateChallan />
          </div>
        )}

        {activeSection === "inventory" && (
          <div className="dashboard-card">
            <GetInventory />
          </div>
        )}
        {activeSection === "AllStamp" && (
          <div className="dashboard-card">
            {/* <GetAllStamp /> */}
            <IssuedStamps />
          </div>
        )}
        {/* {activeSection === "search" && (
          <div className="dashboard-card">
            <SearchStamp />
          </div>
        )} */}

        <div className="mt-6">
          <Outlet />
        </div>

      </div>
    </div>

  );

}



