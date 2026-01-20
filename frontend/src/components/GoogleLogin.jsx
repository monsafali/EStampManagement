


// GoogleLogin.jsx
import { useGoogleLogin } from "@react-oauth/google";

import { useContext } from "react";
import { GoogleAuthContext } from "../ GoogleAuthContext";
import { API_BASE_URL } from "../api";




export default function GoogleLogin() {
  const { login } = useContext(GoogleAuthContext);

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const res = await API_BASE_URL.post(
        "api/auth/google",
        {
          access_token: tokenResponse.access_token,
        },
      );

      const { user, token } = res.data;
      login(user, token);
    } catch (err) {
      console.error("Google Login Error", err.response?.data);
    }
  },
});


  return (
    <button
      onClick={() => googleLogin()}
      className="login-with-google-btn"
    >
      Login with Google
    </button>
  );
}




