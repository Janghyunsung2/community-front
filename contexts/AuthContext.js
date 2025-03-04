import { createContext, useState, useEffect, useContext } from "react";
import api from "@/utils/axios";
import SEOHead from "@/components/SEOHead";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const checkLoginStatus = async () => {
    try {
      const res = await api.get("/api/auth/me", { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
