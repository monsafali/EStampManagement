import { Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import LogoutButton from "./LogoutButton";
import ChangePassword from "./ChangePassword";
import "../styles/components/Navbar.css";


export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [openProfile, setOpenProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
        setShowEditForm(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-logo">E-Stamp System</div>

      <nav className="navbar-links">
        {!user && <Link to="/login" className="navbar-link">Login</Link>}

        {user?.role === "vendor" && (
          <Link to="/vendor" className="navbar-link">Vendor</Link>
        )}
        {user?.role === "bank" && (
          <Link to="/bank" className="navbar-link">Bank</Link>
        )}
        {user?.role === "ADCAdmin" && (
          <Link to="/adc" className="navbar-link">ADC Admin</Link>
        )}
        {user?.role === "super-admin" && (
          <Link to="/superadmin" className="navbar-link">Super Admin</Link>
        )}

        {/*  Profile Dropdown */}
        {user && (
          <div className="user-profile" ref={profileRef}>
            <button
              className="user-btn"
              onClick={() => setOpenProfile(!openProfile)}
            >
              Profile ⌄
            </button>

            {openProfile && (
              <div className="user-dropdown">
                <p><b>Name:</b> {user.username}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>

                <button
                  className="edit-profile-btn"
                  onClick={() => setShowEditForm(!showEditForm)}
                >
                  {showEditForm ? "Close" : "Edit Profile"}
                </button>

                {/*  Show Change Password Form */}
                {showEditForm && <ChangePassword />}
              </div>
            )}
          </div>
        )}

        {/* Logout button always visible (outside dropdown) */}
        {user && (
          <div className="logout-wrapper">
            <LogoutButton />
          </div>
        )}
      </nav>
    </header>
  );
}
