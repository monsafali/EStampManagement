import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";
import "../styles/global/form.css";
import "../styles/pages/login.css";


function Login() {
  const { setUser } = useContext(AuthContext);
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

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
    //  STEP 0: Client-side validation (no loading if empty)na nazar aye
    if (!formData.username || !formData.password || !formData.role) {
      setError("Please fill all fields.");
      return; //  Stops here, no flicker, no API call
    }

    setLoading(true); //  only runs when fields are NOT empty

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("OTP sent to your email!");
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
      toast.error("Please enter OTP");

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
      if (!res.data.success) {
        throw new Error(res.data.message || "OTP verification failed");
      }
      toast.success("Login successful!");

      // FINAL LOGIN SUCCESS
      setShowOtpPopup(false);

      // Backend returns user → Set the logged-in user in context
      setUser(res.data.user || { username: formData.username });

      // window.location.href = "/"; // redirect if needed
      // after success
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");

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
      toast.success("Logged out from other device successfully!");

    } catch (err) {
      setError("Something went wrong.");
    }

    setLogoutLoading(false);
  };

  // ---------------------------------------------------------
  // UI PART
  // ---------------------------------------------------------
  return (
    <div className="login-wrapper">
      <div style={{ width: "100%" }}>
        <h2 className="login-title">E-Stamp</h2>

        <form onSubmit={handleSubmit} className="form-container">
          <h6 className="login-sm-title">Login in to E-Stamp</h6>
          {/* user name filed */}
          <div className="form-group floating">
            <input
              type="text"
              name="username"
              id="username"
              placeholder=" "
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <label htmlFor="username">User Name</label>
          </div>
          {/* password filed */}
          <div className="form-group floating">
            <input
              type="password"
              name="password"
              id="pwd"
              placeholder=" "
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <label htmlFor="pwd">Password</label>
          </div>
          {/* role filed */}
          <div className="form-group floating">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="" disabled hidden></option>
              <option value="super-admin">Super Admin</option>
              <option value="ADCAdmin">ADC Admin</option>
              <option value="vendor">Vendor</option>
              <option value="bank">Bank</option>
            </select>
            <label htmlFor="role">Role</label>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>
        </form>

        {/* Logout Other Device Button */}
        <div className="logout-container">
          <button
            onClick={logoutOtherDevice}
            className="logout-other-btn"
            disabled={logoutLoading}
          >
            {logoutLoading ? "Processing..." : "Logout Other Device"}
          </button>
        </div>
      </div>


      {/* OTP POPUP */}
      {showOtpPopup && (
        <div className="otp-overlay">
          <div className="otp-box">
            <h3>Enter OTP</h3>

            <input
              style={{ padding: 10, width: "100%" }}
              placeholder="Type your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="otp-actions">
              <button
                onClick={verifyOtp}
                className="otp-btn verify-btn"
              >
                Verify OTP
              </button>
              <button
                onClick={() => setShowOtpPopup(false)}
                className="otp-btn close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;


