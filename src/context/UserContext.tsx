import React, { createContext, useContext, useEffect, useState } from "react";

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

// Default placeholder user
const defaultUser: UserProfile = {
  id: 42,
  rank: 15,
  username: "User 42",
  tier: "dreg",
  total_points: 1250,
};

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
    identity: string,
    password: string
  ): Promise<boolean> => {
    // Mock login - in production this would call an API
    // For now, accept any identity/password and return default user
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Mock: Use identity to determine tier (for testing)
    let mockUser = { ...defaultUser };
    if (identity.toLowerCase().includes("elite")) {
      mockUser.tier = "elite";
      mockUser.username = identity;
    } else if (identity.toLowerCase().includes("citizen")) {
      mockUser.tier = "citizen";
      mockUser.username = identity;
    } else {
      mockUser.tier = "dreg";
      mockUser.username = identity;
    }

    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
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
