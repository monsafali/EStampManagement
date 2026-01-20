import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import "../../src/styles/components/logout.css"
import { API_BASE_URL } from "../api";




export default function LogoutButton() {
  const { setUser } = useContext(AuthContext);

const handleLogout = async () => {
  try {
    await API_BASE_URL.post("/api/auth/logout");

    setUser(null); // clear auth context
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
