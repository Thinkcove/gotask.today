import env from "../env";

// Check if token is expired
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

// Fetch tokens from storage
export const fetchToken = (): string | null =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const fetchRefreshToken = (): string | null =>
  localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");

// Store tokens to storage
export const storeTokens = (
  token: string,
  refreshToken: string,
  rememberMe: boolean
) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("token", token);
  storage.setItem("refreshToken", refreshToken);

  const user = localStorage.getItem("user");
  if (user) storage.setItem("user", user);
};

// Remove tokens from storage
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
};

// Main auth wrapper
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
          body: JSON.stringify({ refreshToken }),
        });

        const data = await res.json();

        if (res.ok && data.success && data.data?.accessToken) {
          const newToken = data.data.accessToken;
          const newRefresh = data.data.refreshToken;

          storeTokens(newToken, newRefresh, true); // rememberMe default true
          return await callback(newToken);
        } else {
          removeToken();
          return { error: "Session expired. Please login again." };
        }
      } catch (err) {
        removeToken();
        return { error: "Token refresh failed. Please login again." };
      }
    } else {
      return { error: "An error occurred." };
    }
  }
};
