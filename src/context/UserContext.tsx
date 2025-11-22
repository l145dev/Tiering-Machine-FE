import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../services/api";

export type Tier = "elite" | "citizen" | "dreg";

export interface UserProfile {
  id: number;
  rank: number;
  username: string;
  tier: Tier;
  total_points: number;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<UserProfile>) => void;
  login: (identity: string, password: string) => Promise<boolean>;
  logout: () => void;
}



const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Load from localStorage or use null
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth === "true") {
      const savedUser = localStorage.getItem("user_profile");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    // Save to localStorage whenever user or auth state changes
    if (user && isAuthenticated) {
      localStorage.setItem("user_profile", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("user_profile");
      localStorage.setItem("isAuthenticated", "false");
    }
  }, [user, isAuthenticated]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const login = async (
    citizenNumber: string,
    password: string
  ): Promise<boolean> => {
    try {
      const data = await loginUser({ citizenNumber, password });

      const userProfile: UserProfile = {
        id: data.id,
        rank: data.rank,
        username: data.username,
        tier: data.tier.toLowerCase() as Tier,
        total_points: data.totalPoints,
      };

      setUser(userProfile);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user_profile");
    localStorage.setItem("isAuthenticated", "false");
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, updateUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
