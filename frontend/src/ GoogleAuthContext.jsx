// import { createContext, useState } from "react";

// export const GoogleAuthContext = createContext();

// export default function GoogleAuthProvider({ children }) {
//   const [googleUser, setGoogleUser] = useState(() => {
//     const saved = localStorage.getItem("googleUser");
//     return saved ? JSON.parse(saved) : null;
//   });

//   const login = (userData) => {
//     localStorage.setItem("googleUser", JSON.stringify(userData));
//     setGoogleUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("googleUser");
//     setGoogleUser(null);
//   };

//   return (
//     <GoogleAuthContext.Provider value={{ googleUser, login, logout }}>
//       {children}
//     </GoogleAuthContext.Provider>
//   );
// }


























// GoogleAuthContext.jsx
import { createContext, useState } from "react";

export const GoogleAuthContext = createContext();

export default function GoogleAuthProvider({ children }) {
  // Load saved user/token from localStorage (if any)
  const [googleUser, setGoogleUser] = useState(() => {
    try {
      const saved = localStorage.getItem("googleUser");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("googleToken") || null;
    } catch (e) {
      return null;
    }
  });

  // login should accept (userData, token)
  const login = (userData, tokenData) => {
    if (!userData) return;
    // store user
    localStorage.setItem("googleUser", JSON.stringify(userData));
    setGoogleUser(userData);

    // store token separately
    if (tokenData) {
      localStorage.setItem("googleToken", tokenData);
      setToken(tokenData);
    }
  };

  const logout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("googleToken");
    setGoogleUser(null);
    setToken(null);
  };

  return (
    <GoogleAuthContext.Provider
      value={{ googleUser, token, login, logout }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
}
