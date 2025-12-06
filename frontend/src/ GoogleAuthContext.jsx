import { createContext, useState } from "react";

export const GoogleAuthContext = createContext();

export default function GoogleAuthProvider({ children }) {
  const [googleUser, setGoogleUser] = useState(() => {
    const saved = localStorage.getItem("googleUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem("googleUser", JSON.stringify(userData));
    setGoogleUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("googleUser");
    setGoogleUser(null);
  };

  return (
    <GoogleAuthContext.Provider value={{ googleUser, login, logout }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}
