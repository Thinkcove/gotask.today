"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { withAuth } from "../utils/authToken"; // Adjust path

// Use a generic function signature with proper typing
export const useAuthCallback = () => {
  const router = useRouter();

  // Fix generic T and dependency array
  const authCallback = useCallback(
    async <T,>(callback: (token: string) => Promise<T>): Promise<T | undefined> => {
      const result = await withAuth(callback);

      // Type guard to check if result is an error object
      if (typeof result === "object" && result !== null && "error" in result) {
        router.push("/login");
        return undefined;
      }

      // Result is of type T here
      return result as T;
    },
    [router] // dependency array must be an array, never a Promise or other value
  );

  return authCallback;
};
