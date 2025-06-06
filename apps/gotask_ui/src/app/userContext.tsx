"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchToken, fetchRefreshToken, removeToken } from "./common/utils/authToken";

interface AccessDetail {
  id: string;
  name: string;
  application: {
    access: string;
    actions: string[];
    _id: string;
  }[];
}

interface Role {
  id: string;
  name: string;
  accessDetails: AccessDetail[];
}

interface User {
  id: string;
  name: string;
  roleId: { id: string; name: string };
  user_id: string;
  status: boolean;
  token: string;
  refreshToken: string;
  role: Role;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = fetchToken();
    const refreshToken = fetchRefreshToken();

    if (storedUser && token && refreshToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setUser({ ...parsedUser, token, refreshToken });
        } else {
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("user");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/login";
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
