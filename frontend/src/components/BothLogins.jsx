import React, { useContext } from "react";
import ChatSupport from './ChatSupport';
import "../styles/pages/login.css"


// import { GoogleLogin } from "@react-oauth/google";
import Login from "./Login";
import GoogleLogin from './GoogleLogin';
import { GoogleAuthContext } from '../ GoogleAuthContext';



const BothLogins = () => {
  const { googleUser } = useContext(GoogleAuthContext);

  return (
    <div className="login-wrapper-both">
      <div className="auth-combined-box">
        {/* Your RBAC Login System */}
        <Login />
        <div className="auth-divider">OR</div>
        {/* Chat Support Section */}
          <h2>Chat Support</h2>
          <div className="chat-box-container">
            {!googleUser ? <GoogleLogin /> : <ChatSupport />}
          </div>
      </div>
    </div>
  );
};


export default BothLogins;


