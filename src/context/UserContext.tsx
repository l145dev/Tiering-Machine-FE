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
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
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
  const [user, setUser] = useState<UserProfile>(() => {
    // Load from localStorage or use default
    const savedUser = localStorage.getItem("user_profile");
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  useEffect(() => {
    // Save to localStorage whenever user changes
    localStorage.setItem("user_profile", JSON.stringify(user));
  }, [user]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
