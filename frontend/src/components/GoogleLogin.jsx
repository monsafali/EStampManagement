
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
        // send the code to backend which exchanges for tokens and returns user + token
        const res = await axios.get(
          `http://localhost:5000/api/auth/google?code=${response.code}`
        );
        console.log("Google login response:", res.data);

        // Expecting backend to return { message, user, token }
        const backendUser = res.data.user;
        const backendToken = res.data.token;

        if (!backendUser || !backendToken) {
          console.error("Backend did not return user or token", res.data);
          return;
        }

        // Build the object we store in context/localStorage
        const userData = {
          _id: backendUser._id,         // IMPORTANT: store DB _id
          name: backendUser.name,
          email: backendUser.email,
          image: backendUser.image || backendUser.picture || null,
        };

        // Use login to persist both user and token
        login(userData, backendToken);

        // console.log("Saved googleUser:", userData);
      } catch (err) {
        // console.error("Google Login Error:", err.response?.data || err.message);
      }
    },
    onError: (err) => console.log("Google Login Failed", err),
  });

  return (
    <button
      onClick={() => googleLogin()}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Login with Google
    </button>
  );
}




