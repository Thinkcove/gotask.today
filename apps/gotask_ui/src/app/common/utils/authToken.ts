import env from "../env";

// Helper: choose storage based on rememberMe flag
const getStorage = (rememberMe: boolean) => (rememberMe ? localStorage : sessionStorage);

// Check if token is expired (JWT expiry)
const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < now;
  } catch {
    return true;
  }
};

// Store token, rememberMe flag, loginTimestamp, and user in appropriate storage
export const storeToken = (token: string, rememberMe: boolean, user: any) => {
  const now = Date.now();
  const storage = getStorage(rememberMe);
  
  // Clear both storages first (to avoid stale data)
  localStorage.clear();
  sessionStorage.clear();

  storage.setItem("token", token);
  storage.setItem("rememberMe", rememberMe ? "true" : "false");
  storage.setItem("loginTimestamp", now.toString());
  storage.setItem("user", JSON.stringify(user));
};

// Fetch token from appropriate storage (check localStorage first)
export const fetchToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Fetch user from appropriate storage (check localStorage first)
export const fetchUser = (): any | null => {
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Remove token, user, rememberMe, loginTimestamp from both storages
export const removeToken = () => {
  localStorage.clear();
  sessionStorage.clear();
};

// Check if session is valid based on rememberMe and loginTimestamp in correct storage
const isSessionValid = (): boolean => {
  // Check rememberMe from either storage
  const rememberMe = (localStorage.getItem("rememberMe") || sessionStorage.getItem("rememberMe")) === "true";

  // Get loginTimestamp from correct storage
  const loginTimestampStr = rememberMe ? localStorage.getItem("loginTimestamp") : sessionStorage.getItem("loginTimestamp");
  if (!loginTimestampStr) return false;

  const loginTimestamp = parseInt(loginTimestampStr, 10);
  const now = Date.now();

  if (rememberMe) {
    // Remember Me: session persists until token expiry
    return true;
  } else {
    // Non-remember me: expire after 30 minutes (example)
    const sessionDurationMs = 30 * 60 * 1000; // 30 mins
    return now - loginTimestamp < sessionDurationMs;
  }
};

// Main auth wrapper (no refresh token logic)
export const withAuth = async <T>(
  callback: (token: string) => Promise<T>
): Promise<T | { error: string }> => {
  const token = fetchToken();

  if (!token || isTokenExpired(token) || !isSessionValid()) {
    removeToken();
    return { error: "Session expired. Please log in again." };
  }

  try {
    return await callback(token);
  } catch (err: any) {
    if (err?.message === "jwt expired" || err?.status === 401) {
      removeToken();
      return { error: "Session expired. Please log in again." };
    }
    return { error: "An error occurred." };
  }
};
