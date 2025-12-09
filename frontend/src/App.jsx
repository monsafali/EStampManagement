import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import ChatWidget from "./components/ChatWidget";
// import FloatingChat from "./components/FloatingChat";


import Login from "./components/Login";
import ADCDashboard from "./pages/ADCDashboard";
import BankDashboard from "./pages/BankDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Success from "./pages/Vendor/Success";
import VendorMontyReport from "./pages/AdcAdmin/VendorMontyReport.jsx";
import BothLogins from './components/BothLogins';







export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  const redirectRole = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "vendor":
        return "/vendor";
      case "bank":
        return "/bank";
      case "ADCAdmin":
        return "/adc";
      case "super-admin":
        return "/superadmin";
      default:
        return "/login";
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={redirectRole()} /> : <BothLogins />}
        />

        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="payment-success" element={<Success />} />
        </Route>

        <Route
          path="/bank"
          element={
            <ProtectedRoute allowedRoles={["bank"]}>
              <BankDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adc"
          element={
            <ProtectedRoute allowedRoles={["ADCAdmin"]}>
              <ADCDashboard />
            </ProtectedRoute>
          }
        >
          <Route
            path="monthly-report/:vendorId"
            element={<VendorMontyReport />}
          />
        </Route>

        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={redirectRole()} />} />
      </Routes>
        {/* Floating Chat for logged-in Google users */}
   <ChatWidget />

    </BrowserRouter>
  );
}
