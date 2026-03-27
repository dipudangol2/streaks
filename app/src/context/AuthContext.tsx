import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

interface User {
  userId: string;
  email: string;
  name?: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.success && res.user) {
          setUser(res.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: any) => {
    const res = await api.post("/auth/login", data);
    if (res.user) {
      setUser(res.user);
    }
  };

  const signup = async (data: any) => {
    const res = await api.post("/auth/sign-up", data);
    if (res.success && res.data) {
      // Signup gives data object containing the user info according to AuthController.ts
      // Note: we might need to fetch the complete user or login again to get the cookie.
      // But let's assume successful signup logs you in if it sets cookie?
      // Wait, signup doesn't set cookie in AuthController! Let me check AuthController again.
      // It just returns 201 without cookie! So we need to log them in after signup.
      // Or they have to login separately. Let's do a login call right after.
      await api.post("/auth/login", data);
      const userRes = await api.get("/auth/me");
      if (userRes.user) {
        setUser(userRes.user);
      }
    }
  };

  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
