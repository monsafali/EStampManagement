import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import ChangePassword from "../components/ChangePassword";
import LogoutButton from "../components/LogoutButton";
import GetVendor from "./AdcAdmin/GetVendor";
import CreateVendor from "./AdcAdmin/CreateVendor";
import CreateBankUser from "./AdcAdmin/CreateBankUser";
import { Outlet } from "react-router-dom";

export default function ADCDashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">
        Welcome {user?.username} to ADC Dashboard
      </h1>

      <p className="mt-2 text-gray-600">ADC Admin Panel</p>

      {/* Logout Button */}
      <LogoutButton />

      {/* Change Password Section */}
      <ChangePassword />
      <GetVendor />

      <h1>create Vendor</h1>
      <CreateVendor districtId={user.districtId} districtName={user.district} />

      <h1>Create Bank User</h1>
      <CreateBankUser />

      <Outlet />
    </div>
  );
}
