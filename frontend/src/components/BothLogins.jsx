import React, { useContext } from "react";
import "../styles/pages/login.css"
// import { GoogleLogin } from "@react-oauth/google";
import Login from "./Login";

import { GoogleAuthContext } from '../ GoogleAuthContext';



const BothLogins = () => {
  const { googleUser } = useContext(GoogleAuthContext);

  return (
    <div className="login-wrapper-both">
      <div className="auth-combined-box">
        {/* Your RBAC Login System */}
        <Login />
      </div>
    </div>
  );
};


export default BothLogins;


