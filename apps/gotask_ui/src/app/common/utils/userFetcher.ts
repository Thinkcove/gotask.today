// common/utils/userFetcher.ts
export const fetchUserFromStorage = async () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (user && token) {
    const parsed = JSON.parse(user);
    return { ...parsed, token };
  }

  return null;
};
