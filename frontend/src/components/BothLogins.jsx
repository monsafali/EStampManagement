import React, { useContext } from "react";
import "../styles/pages/login.css"
// import { GoogleLogin } from "@react-oauth/google";
import Login from "./Login";
import ChatWidget from "./ChatWidget";
import { AuthContext } from "../AuthContext";
import { GoogleAuthContext } from '../ GoogleAuthContext';



const BothLogins = () => {
  const { googleUser } = useContext(GoogleAuthContext);
  const { user } = useContext(AuthContext);
  return (
    <div className="login-wrapper-both">
      <div className="auth-combined-box">
        {/* Your RBAC Login System */}
        <Login />
      </div>
      {/* Show chat only when user is NOT logged in */}
      {!user && <ChatWidget />}
    </div>
  );
};


export default BothLogins;


