// src/app/common/utils/authToken.ts
import env from "../env";

const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < now;
  } catch {
    return true; // If token invalid, consider expired
  }
};

// --- TOKEN HELPERS ---
export const fetchToken = (): string | null => localStorage.getItem("token");
export const fetchRefreshToken = (): string | null => localStorage.getItem("refreshToken");

export const storeTokens = (token: string, refreshToken: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// --- AUTH WRAPPER ---
export const withAuth = async <T>(
  callback: (token: string) => Promise<T>
): Promise<T | { error: string }> => {
  const token = fetchToken();
  const refreshToken = fetchRefreshToken();

  if (!token || !refreshToken) {
    removeToken();
    return { error: "Session expired. Please log in again." };
  }

  // Here token and refreshToken are guaranteed to be string (not null)
  // So we can safely pass `token` to callback and others

  try {
    return await callback(token); // no error because token is string, not null
  } catch (err: any) {
    if (err?.message === "jwt expired" || err?.status === 401) {
      // Try to refresh token
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

          storeTokens(newToken, newRefresh);
          return await callback(newToken); // Retry with new token (string)
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
