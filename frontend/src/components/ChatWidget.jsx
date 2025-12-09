import React, { useState, useContext } from "react";
import ChatSupport from "./ChatSupport";
import GoogleLogin from "./GoogleLogin";
import { GoogleAuthContext } from "../ GoogleAuthContext";
import "../styles/components/chat.css";


export default function ChatWidget() {
  const { googleUser } = useContext(GoogleAuthContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-widget-container">

      {/* Floating Button */}
      <button 
        className="chat-widget-btn"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {/* Popup Window */}
      {open && (
        <div className="chat-widget-box">
          {!googleUser ? <GoogleLogin /> : <ChatSupport />}
        </div>
      )}

    </div>
  );
}
