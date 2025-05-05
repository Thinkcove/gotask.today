// utils/auth.ts

export const fetchToken = (): string | null => {
  return localStorage.getItem("token");
};

export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
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
