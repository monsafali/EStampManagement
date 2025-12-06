

import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import ChangePassword from "../components/ChangePassword";
import LogoutButton from "../components/LogoutButton";

import { Outlet } from "react-router-dom";
import Stamp from "./Vendor/Stamp";
import GenerateChallan from './Vendor/GenerateChallan';
import GetAllStamp from "./Vendor/GetAllStamp";
import GetInventory from "./Vendor/GetInventory";
import SearchStamp from "./Vendor/SearchStamp";




export default function VendorDashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">
        Welcome {user?.username} to Vendor Dashboard
      </h1>

      <p className="mt-2 text-gray-600">Vendor Admin Panel</p>

      {/* Logout Button */}
      <LogoutButton />

      {/* Change Password Section */}
      <ChangePassword />
      <Stamp />

      <h1 className="mt-6 text-2xl font-bold">Generate Challan</h1>
      <GenerateChallan />

      <div className="mt-6">
        <Outlet />
      </div>

      <GetAllStamp />
      <h1>Get Inventory</h1>
      <GetInventory />
      <SearchStamp />
    </div>
  );
}