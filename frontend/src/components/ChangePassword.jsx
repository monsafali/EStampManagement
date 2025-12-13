import { useState } from "react";
import "../styles/components/change-password.css";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  // const [message, setMessage] = useState("");
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
      <h2 className="change-password-title">Change Password</h2>

      {/* Old Password */}
      <div className="form-group">
        <input
          type={showOld ? "text" : "password"}
          placeholder=" "
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>Old Password </label>
        <span
          className="password-toggle"
          onClick={() => setShowOld(!showOld)}
        >
          {showOld ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
        </span>
      </div>

      {/* New Password */}
      <div className="form-group">
        <input
          type={showNew ? "text" : "password"}
          placeholder=" "
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>New Password</label>
        <span
          className="password-toggle"
          onClick={() => setShowNew(!showNew)}
        >
          {showNew ? <VisibilityOffIcon  fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
        </span>
      </div>


      {/* Message */}
      {/* {message && (
        <p className={`change-password-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )} */}

      {/* Button */}
      <button type="submit" disabled={loading} className="change-password-btn">
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
