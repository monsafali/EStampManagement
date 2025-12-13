import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import ChangePassword from "../components/ChangePassword";
import LogoutButton from "../components/LogoutButton";
import GetVendor from "./AdcAdmin/GetVendor";
import CreateVendor from "./AdcAdmin/CreateVendor";
import CreateBankUser from "./AdcAdmin/CreateBankUser";
import { Outlet } from "react-router-dom";
import "../styles/pages/ADCdashboard.css"

export default function ADCDashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="adc-dashboard">
      <h1 className="dashboard-title">
        Welcome {user?.username} to ADC Dashboard
      </h1>

      <p className="dashboard-subtitle">ADC Admin Panel</p>

 
      {/* Vendors Section */}
      <div className="adc-section">
        <h2>Vendors List</h2>
        <GetVendor />
      </div>

      {/* Create Vendor Section */}
      <div className="adc-section">
        <h2>Create Vendor</h2>
        <CreateVendor districtId={user.districtId} districtName={user.district} />
      </div>


      {/* Create Bank User Section */}
      <div className="adc-section">
        <h2>Create Bank User</h2>
        <CreateBankUser />
      </div>

      <Outlet />
    </div>
  );
}
