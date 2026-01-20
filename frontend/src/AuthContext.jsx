import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "./api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  // Check if user cookie is still valid
useEffect(() => {
  const getMe = async () => {
    try {
      const res = await API_BASE_URL.get("/api/auth/Getme");
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  getMe();
}, []);


  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
