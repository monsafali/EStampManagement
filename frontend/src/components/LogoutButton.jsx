import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import "../../src/styles/components/logout.css"

export default function LogoutButton() {
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        alert("Failed to logout!");
        return;
      }

      setUser(null); // clear context
      window.location.href = "/login"; // redirect
    } catch (error) {
      alert("Something went wrong during logout.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-btn"
    >
      Logout
    </button>
  );
}
