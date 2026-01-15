import { Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";

import { AuthContext } from "../AuthContext";
import LogoutButton from "./LogoutButton";
import Tooltip from "./common/Tooltip";
import ChangePassword from "./ChangePassword";

import logo from "../assets/e-stamp-logo.png"
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "../styles/components/Navbar.css";



export default function Navbar() {
  const { user } = useContext(AuthContext);

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
      <div className="navbar-logo">
        <img src={logo} alt="m" />
        <h1 className="navbar-title">E-stamp</h1>

      </div>

      <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {/*  Profile Dropdown */}
        {user && (
          <Tooltip text="View Profile" position="bottom">
            <div className="user-profile" ref={profileRef} >
              <button
                className="user-btn"
                onClick={() => setOpenProfile((prev) => !prev)}
              >
                <span>Profile</span>
                <KeyboardArrowDownIcon
                  sx={{
                    color: openProfile
                      ? "var(--color-primary)"
                      : "var(--text-strong)",
                  }}
                  className={`arrow ${openProfile ? "rotate" : ""}`}
                />
              </button>
              {openProfile && (
                <div className="user-dropdown">
                  <p><b>Name:</b> {user.username}</p>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Role:</b> {user.role}</p>

                  <button
                    className="edit-profile-btn sliding-overlay-btn"
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
          </Tooltip>
        )}


        {/* Logout button  */}
        {user && (
          <Tooltip text="Logout" position="bottom">

            <LogoutButton />

          </Tooltip>
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
