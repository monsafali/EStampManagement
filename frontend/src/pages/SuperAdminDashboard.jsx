

import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import ChangePassword from "../components/ChangePassword";
import LogoutButton from "../components/LogoutButton";
import CreateADCAdmin from './SuperAdmin/CreateADCAdmin';
import ManageADCAdmins from "./SuperAdmin/ManageADCAdmins";


export default function SuperAdminDashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">
        Welcome {user?.username} to Super Admin Dashboard
      </h1>

      <p className="mt-2 text-gray-600">Super Admin Dashboard Panel</p>

      {/* Logout Button */}
      <LogoutButton />

      {/* Change Password Section */}
      <ChangePassword />
      <CreateADCAdmin />
      <h1>Get All Adc Admin</h1>
      <ManageADCAdmins/>

    </div>
  );
}



