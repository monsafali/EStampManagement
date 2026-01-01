import { Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";

import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../AuthContext";
import LogoutButton from "./LogoutButton";
import ChangePassword from "./ChangePassword";

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import "../styles/components/Navbar.css";


export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const profileRef = useRef(null);

  const [openProfile, setOpenProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenProfile(false);
        setShowEditForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
// Close profile when mobile menu closes
  useEffect(() => {
    if (!menuOpen) {
      setOpenProfile(false);
      setShowEditForm(false);
    }
  }, [menuOpen]);


  return (
    <header className="navbar">
      <div className="navbar-logo">E-Stamp System</div>

      <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
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

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon sx={{ color: "#000" }} />
          }
        </button>


        {/*  Profile Dropdown */}
        {user && (
          <div className="user-profile" ref={profileRef} >
            <button
              className="user-btn"
              onClick={() => setOpenProfile((prev) => !prev)}
            >
            <span>Profile</span>  <span>⌄</span> 
            </button>
            {openProfile && (
              <div className="user-dropdown">
                <p><b>Name:</b> {user.username}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>
                <button
                  className="edit-profile-btn"
                  onClick={() => setShowEditForm(true)}
                >
                  Change Password
                </button>
                {/* Show Change Password Panel (outside dropdown) */}
                {showEditForm && (
                  <div className="change-password-panel">
                    <ChangePassword onClose={() => setShowEditForm(false)} />
                  </div>
                )}

              </div>
            )}

          </div>
        )}


        {/* Logout button  */}
        {user && (
            <LogoutButton />
        )}

      </nav>
      {/* Hamburger (mobile only) */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

    </header>
  );
}
