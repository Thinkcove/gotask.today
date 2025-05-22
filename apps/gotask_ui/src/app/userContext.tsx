"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchToken, removeToken } from "./common/utils/authToken";

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

interface Preference {
  module_name: string;
  exclude_fields: string[];
  _id: string;
}

interface User {
  id: string;
  name: string;
  roleId: { id: string; name: string };
  user_id: string;
  status: boolean;
  token: string;
  role: Role;
  preferences?: Preference[];
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

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setUser({ ...parsedUser, token });
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
    localStorage.removeItem("user");
    removeToken();
    setUser(null);
    window.location.href = "/login"; // Redirect to login
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};

// Custom hook to use UserContext easily
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
