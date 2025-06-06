import env from "../env";

// Check if JWT token is expired
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

// Fetch token from either localStorage or sessionStorage
export const fetchToken = (): string | null =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Fetch refresh token similarly
export const fetchRefreshToken = (): string | null =>
  localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");

// Store tokens and user data based on rememberMe
export const storeTokens = (
  token: string,
  refreshToken: string,
  rememberMe: boolean,
  user?: object
) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  // Clear both storages first to avoid duplicates
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");

  // Store tokens in the chosen storage
  storage.setItem("token", token);
  storage.setItem("refreshToken", refreshToken);

  if (user) {
    storage.setItem("user", JSON.stringify(user));
  }
};

// Remove tokens & user from both storages
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
};

// Auth wrapper for API calls with auto token refresh
export const withAuth = async <T>(
  callback: (token: string) => Promise<T>
): Promise<T | { error: string }> => {
  const token = fetchToken();
  const refreshToken = fetchRefreshToken();

  if (!token || !refreshToken) {
    removeToken();
    return { error: "Session expired. Please log in again." };
  }

  try {
    return await callback(token);
  } catch (err: any) {
    if (err?.message === "jwt expired" || err?.status === 401) {
      try {
        const res = await fetch(`${env.API_BASE_URL}/otp/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        });

        const data = await res.json();

        if (res.ok && data.success && data.data?.accessToken) {
          const newToken = data.data.accessToken;
          const newRefresh = data.data.refreshToken;

          // Keep the previous "rememberMe" logic consistent here, default true
          storeTokens(newToken, newRefresh, true);
          return await callback(newToken);
        } else {
          removeToken();
          return { error: "Session expired. Please login again." };
        }
      } catch {
        removeToken();
        return { error: "Token refresh failed. Please login again." };
      }
    } else {
      return { error: "An error occurred." };
    }
  }
};
