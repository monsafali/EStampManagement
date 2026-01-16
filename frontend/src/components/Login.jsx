
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import CustomSelect from "./common/CustomSelect";
import PasswordInput from "./common/PasswordInput";
import Modal from "./common/Modal";

import axios from "axios";

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import "../styles/global/form.css";
import "../styles/pages/login.css";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });
  const roleOptions = [
    { value: "super-admin", label: "Super Admin" },
    { value: "ADCAdmin", label: "ADC Admin" },
    { value: "vendor", label: "Vendor" },
    { value: "bank", label: "Bank" },
  ];

  // -------------------------------------------------
  // STEP 1 → Send username/password and get OTP
  // -------------------------------------------------
  const onSubmit = async (data) => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("OTP sent to your email!");
        setShowOtpPopup(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
          username: watch("username"),
          otp,
        },
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error();
      }

      toast.success("Login successful!");
      setShowOtpPopup(false);

      setUser(res.data.user || { username: watch("username") });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  // ---------------------------------------------------------
  // Logout From Other Devices
  // ---------------------------------------------------------
  const logoutOtherDevice = async () => {
    const username = watch("username");

    if (!username) {
      setError("Please enter username first.");
      return;
    }

    setError("");
    setLogoutLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset/${username}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to logout other device");
        return;
      }

      toast.success("Logged out from other device successfully!");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div>
        <h2 className="login-title">E-Stamp</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <h6 className="login-sm-title">Login in to E-Stamp</h6>

          {/* USERNAME */}
          <div className="form-group input-with-icons">
            <input
              placeholder=" "
              className={errors.username ? "error" : ""}
              {...register("username", {
                required: "Username is required",
              })}
            />
            <label>User Name</label>
            <span className="input-icon">
              <PersonOutlineOutlinedIcon />

            </span>
            {errors.username && (
              <span className="input-error">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* PASSWORD */}

          <PasswordInput
            name="password"
            label="Password"
            register={register}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            }}
            error={errors.password?.message}
          />

          {/* ROLE */}
          <div className="form-group">
            <CustomSelect
              name="role"
              placeholder="Select Role"
              options={roleOptions}
              value={watch("role")}
              register={register}
              setValue={setValue}
              required
              error={errors.role?.message}
            />

          </div>


          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="form-btn login-btn sliding-overlay-btn"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>
        </form>

        {/* Logout Other Device */}
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
        <Modal
          title="Enter OTP"
          subtitle="We sent a verification code to your email"
          onClose={() => setShowOtpPopup(false)}
          closeOnOverlay={false}
        >
          <div className="otp-content">
            <input
              className="otp-input"
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
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

export default Login;
