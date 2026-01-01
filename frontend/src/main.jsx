
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";


/* Toast */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Providers */
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext.jsx";
import GoogleAuthProvider from "./ GoogleAuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

/* Global styles */
import './styles/global/globals.css';
import './styles/global/customAnimation.css'
import "./index.css";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="830663248190-qb03bv8d59agjlm3qmggh9r5ugj0b82k.apps.googleusercontent.com">
    <ThemeProvider>
      <AuthProvider>
        <GoogleAuthProvider>
          {/* <div className="app-container"> */}
            <App />
          {/* </div> */}
          <ToastContainer position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </GoogleAuthProvider>
      </AuthProvider>
    </ThemeProvider>

  </GoogleOAuthProvider>
);
