import React, { useContext } from "react";
import ChatSupport from './ChatSupport';



// import { GoogleLogin } from "@react-oauth/google";
import Login from "./Login";
import GoogleLogin from './GoogleLogin';
import { GoogleAuthContext } from '../ GoogleAuthContext';



const BothLogins = () => {
  const { googleUser } = useContext(GoogleAuthContext);

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Your RBAC Login System */}
      <Login />

      <hr className="my-6" />

      {/* Chat Support Section */}
      <h2 className="text-xl font-bold mb-2">Chat Support</h2>

      {!googleUser ? (
        <GoogleLogin/> // If not logged in → show Google Login button
      ) : (
        <ChatSupport /> // If logged in → show chat UI
      )}
    </div>
  );
};

export default BothLogins;


