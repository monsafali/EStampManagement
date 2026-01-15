import { useState } from "react";
import "../styles/components/change-password.css";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import PasswordInput from "./common/PasswordInput";

export default function ChangePassword({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const [error, setError] = useState(false);



  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    // setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/updatePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        // setMessage(data.message || "Failed to update password.");
        toast.error(data.message || "Old password is incorrect");
        setError(true)
        setLoading(false);
        return;
      }

      // setMessage("Password changed successfully!");
      toast.success(" Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      // setMessage("Something went wrong.");
      toast.error("Something went wrong.");
      setError(true);
    }

    setLoading(false);
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
