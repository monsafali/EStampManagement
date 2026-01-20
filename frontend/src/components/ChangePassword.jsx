import { useState } from "react";
import "../styles/components/change-password.css";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import PasswordInput from "./common/PasswordInput";
import { API_BASE_URL } from "../api";

export default function ChangePassword({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const [error, setError] = useState(false);



  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await API_BASE_URL.put("/api/auth/updatePassword", {
        oldPassword,
        newPassword,
      });

      toast.success(res.data?.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const message =
        err.response?.data?.message || "Old password is incorrect";

      toast.error(message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };


  return (

    <form onSubmit={handlePasswordUpdate} className="change-password-form">
      <button
        type="button"
        className="close-password-btn"
        onClick={onClose}
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <h2 className="change-password-title">Change Password</h2>
      {/* Old Password */}
      <PasswordInput
        label="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      {/* New Password */}
      <PasswordInput
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* Button */}
      <button type="submit" disabled={loading} className="form-btn sliding-overlay-btn">
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
