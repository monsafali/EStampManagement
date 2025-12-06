import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";



function Login() {
  const { setUser } = useContext(AuthContext);
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // -------------------------------------------------
  // STEP 1 → Send username/password and get OTP
  // -------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        setShowOtpPopup(true); // SHOW OTP POPUP
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  // -------------------------------------------------
  // STEP 2 → Verify OTP
  // -------------------------------------------------
  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verifyotp",
        {
          username: formData.username,
          otp,
        },
        { withCredentials: true }
      );

      alert(res.data.message);

      // FINAL LOGIN SUCCESS
      setShowOtpPopup(false);

      // Backend returns user → Set the logged-in user in context
      setUser(res.data.user || { username: formData.username });

      window.location.href = "/"; // redirect if needed
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // ---------------------------------------------------------
  // Logout From Other Devices (Your existing working function)
  // ---------------------------------------------------------
  const logoutOtherDevice = async () => {
    if (!formData.username) {
      setError("Please enter username first.");
      return;
    }

    setError("");
    setLogoutLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset/${formData.username}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to logout other device");
        setLogoutLoading(false);
        return;
      }

      alert("Logged out from other device successfully!");
    } catch (err) {
      setError("Something went wrong.");
    }

    setLogoutLoading(false);
  };

  // ---------------------------------------------------------
  // UI PART
  // ---------------------------------------------------------
  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          name="password"
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="border p-2 w-full"
        />

        <select
          name="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Role</option>
          <option value="super-admin">Super Admin</option>
          <option value="ADCAdmin">ADC Admin</option>
          <option value="vendor">Vendor</option>
          <option value="bank">Bank</option>
        </select>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Login"}
        </button>
      </form>

      {/* Logout Other Device Button */}
      <button
        onClick={logoutOtherDevice}
        className="bg-red-600 text-white w-full py-2 rounded mt-3"
        disabled={logoutLoading}
      >
        {logoutLoading ? "Processing..." : "Logout Other Device"}
      </button>

      {/* OTP POPUP */}
      {showOtpPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 10,
              width: 300,
              textAlign: "center",
            }}
          >
            <h3>Enter OTP</h3>

            <input
              style={{ padding: 10, width: "100%" }}
              placeholder="Type your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <br />
            <br />

            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Verify OTP
            </button>

            <br />
            <br />

            <button
              onClick={() => setShowOtpPopup(false)}
              className="bg-gray-600 text-white w-full py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;


