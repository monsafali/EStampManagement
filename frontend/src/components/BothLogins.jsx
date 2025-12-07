import React, { useContext } from "react";
import ChatSupport from './ChatSupport';



// import { GoogleLogin } from "@react-oauth/google";
import Login from "./Login";
import GoogleLogin from './GoogleLogin';
import { GoogleAuthContext } from '../ GoogleAuthContext';



const BothLogins = () => {
  const { googleUser } = useContext(GoogleAuthContext);

  return (
    <div className="login-wrapper">
      <div className="auth-combined-box">
        {/* Your RBAC Login System */}
        <Login />
        <div className="auth-divider">OR</div>


        {/* Chat Support Section */}
        <div className="chat-box">
          <h2 className="text-xl font-bold mb-3 text-center">Chat Support</h2>

          {!googleUser ? (
            <GoogleLogin /> // If not logged in → show Google Login button
          ) : (
            <ChatSupport /> // If logged in → show chat UI
          )}
        </div>


      </div>



    </div>
  );
};

export default BothLogins;


