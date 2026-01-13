
import React, { useState, useContext, useRef, useEffect } from "react";
import ChatSupport from "./ChatSupport";
import GoogleLogin from "./GoogleLogin";
import ChatIcon from '@mui/icons-material/Chat';
import { GoogleAuthContext } from "../ GoogleAuthContext";
import "../styles/components/chat.css";
import Tooltip from "./common/Tooltip";
export default function ChatWidget() {
  const { googleUser } = useContext(GoogleAuthContext);
  const [open, setOpen] = useState(false);
  const widgetRef = useRef(null);

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="chat-widget-container" ref={widgetRef}>
      {/* Floating Button */}
      <Tooltip text="chat with AI" position="top">
        <button
          className="chat-widget-btn"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <ChatIcon /> <span>Need help?</span>
        </button>
      </Tooltip>


      {/* Popup Window */}
      {open && (
        <div
          className="chat-widget-box"
          onClick={(e) => e.stopPropagation()}
        >
          {!googleUser ? <GoogleLogin /> : <ChatSupport />}
        </div>
      )}
    </div>
  );
}
