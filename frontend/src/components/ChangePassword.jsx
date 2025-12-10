import { useState } from "react";
import "../styles/components/change-password.css";


export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
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
        setMessage(data.message || "Failed to update password.");
        setError(true)
        setLoading(false);
        return;
      }

      setMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage("Something went wrong.");
      setError(true);
    }

    setLoading(false);
  };

  return (
    // <form onSubmit={handlePasswordUpdate} className="change-password-form">
    //   <h2 className="change-password-title">Change Password</h2>

    //   <input
    //     type="password"
    //     placeholder="Old Password"
    //     value={oldPassword}
    //     onChange={(e) => setOldPassword(e.target.value)}
    //     className="change-password-input"
    //   />

    //   <input
    //     type="password"
    //     placeholder="New Password"
    //     value={newPassword}
    //     onChange={(e) => setNewPassword(e.target.value)}
    //     className="form-input"
    //   />

    //   {message && 
    //   <p className={`change-password-message ${error ? "error" : "success"
    //     }`}
    //   >{message}</p>}

    //   <button
    //     type="submit"
    //     disabled={loading}
    //      className="change-password-btn"
    //   >
    //     {loading ? "Updating..." : "Update Password"}
    //   </button>
    // </form>
    <form onSubmit={handlePasswordUpdate} className="form-container">
      <h2 className="change-password-title">Change Password</h2>

      {/* Old Password */}
      <div className="form-group">
        <input
          type="password"
          placeholder=" "
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <label>Old Password</label>
      </div>

      {/* New Password */}
      <div className="form-group">
        <input
          type="password"
          placeholder=" "
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>New Password</label>
      </div>

      {/* Message */}
      {message && (
        <p className={`change-password-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )}

      {/* Button */}
      <button type="submit" disabled={loading} className="change-password-btn">
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
