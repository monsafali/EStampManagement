// GoogleLogin.jsx
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { GoogleAuthContext } from "../ GoogleAuthContext";




export default function GoogleLogin() {
  const { login } = useContext(GoogleAuthContext);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (response) => {
      try {
        // Send code to backend
        const res = await axios.get(
          `http://localhost:5000/api/auth/google?code=${response.code}`
        );

        // BACKEND MUST RETURN: { user, token }

        const userData = {
          name: res.data.user.name,
          email: res.data.user.email,
          picture: res.data.user.image,
          token: res.data.token, // IMPORTANT
        };

        // save to localStorage (in context)
        login(userData);
      } catch (err) {
        console.log("Google Login Error:", err);
      }
    },

    onError: () => console.log("Google Login Failed"),
  });

  return (
    <button
      onClick={googleLogin}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Login with Google
    </button>
  );
}
