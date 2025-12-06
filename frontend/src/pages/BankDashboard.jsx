import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import ChangePassword from "../components/ChangePassword";
import LogoutButton from "../components/LogoutButton";

export default function BankDashboard() {
  const { user, loading } = useContext(AuthContext);

  // Local UI states
  const [challanId, setChallanId] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (loading) return <p>Loading...</p>;

  const handlePayChallan = async () => {
    setResponseMsg("");
    setErrorMsg("");

    if (!challanId.trim()) {
      setErrorMsg("Please enter a challan ID.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bank/payChallan",
        { challanId },
        { withCredentials: true }
      );

      setResponseMsg(res.data.message || "Payment success!");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Something went wrong while paying challan."
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome {user?.username} to Bank Dashboard
      </h1>

      <p className="mt-2 text-gray-600">ADC Admin Panel</p>

      {/* Pay Challan Section */}
      <div className="border p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Pay Challan</h2>

        <input
          type="text"
          placeholder="Enter Challan ID"
          value={challanId}
          onChange={(e) => setChallanId(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />

        <button
          onClick={handlePayChallan}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Pay Challan
        </button>

        {/* Show response */}
        {responseMsg && (
          <p className="mt-3 text-green-600 font-semibold">{responseMsg}</p>
        )}
        {errorMsg && (
          <p className="mt-3 text-red-600 font-semibold">{errorMsg}</p>
        )}
      </div>

      {/* Logout Button */}
      <LogoutButton />

      {/* Change Password Section */}
      <ChangePassword />
    </div>
  );
}
