

import { createRoot } from "react-dom/client";
import App from "./App.jsx";


/* Toast */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Providers */
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext.jsx";
import GoogleAuthProvider from "./ GoogleAuthContext.jsx";


/* Global styles */
import './styles/global/globals.css';
import './styles/global/customAnimation.css'
import './styles/global/slidingOverlayBtn.css'
import "./index.css";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <GoogleAuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </GoogleAuthProvider>
    </AuthProvider>
  </GoogleOAuthProvider>,
);
