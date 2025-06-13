"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchToken, fetchUser, removeToken } from "./common/utils/authToken";

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
  first_name: string;
  last_name: string;
  emp_id: string;
  mobile_no: number;

  alternate_no?: string;
  country: string;
  state: string;

  joined_date: Date;
  name: string;
  roleId: { id: string; name: string };
  user_id: string;
  status: boolean;
  token: string;
  role: Role;

  // certifications?: string[];
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
    const token = fetchToken();
    const storedUser = fetchUser();

    if (storedUser && token) {
      setUser({ ...storedUser, token });
    } else {
      removeToken();
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

export type { User };