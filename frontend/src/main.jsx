
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext.jsx";
import GoogleAuthProvider from "./ GoogleAuthContext.jsx";



createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="830663248190-qb03bv8d59agjlm3qmggh9r5ugj0b82k.apps.googleusercontent.com">
    <AuthProvider>
      <GoogleAuthProvider>
        <App />
      </GoogleAuthProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
