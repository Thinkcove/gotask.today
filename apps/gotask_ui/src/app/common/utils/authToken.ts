import type { User } from "../../userContext";

const getStorage = (rememberMe: boolean) => (rememberMe ? localStorage : sessionStorage);

export const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < now;
  } catch {
    return true;
  }
};

export const storeToken = (token: string, rememberMe: boolean, user: User) => {
  const now = Date.now();
  const storage = getStorage(rememberMe);

  localStorage.clear();
  sessionStorage.clear();

  storage.setItem("token", token);
  storage.setItem("rememberMe", rememberMe ? "true" : "false");
  storage.setItem("loginTimestamp", now.toString());
  storage.setItem("user", JSON.stringify(user));
};

export const fetchToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const fetchUser = (): User | null => {
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const removeToken = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const withAuth = async <T>(
  callback: (token: string) => Promise<T>
): Promise<T | { error: string }> => {
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  return await callback(token);
};
