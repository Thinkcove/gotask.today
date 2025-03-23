"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./provider/authProvider";
import Header from "./component/appBar/header";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login"); // Redirect logged-out users to login
      }
      // Only redirect to /portal/task if no last visited route exists
      else {
        const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
        if (!lastVisitedRoute || lastVisitedRoute === "/login") {
          router.replace("/portal/task");
        }
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null; // Prevent flickering

  // Hide header on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      {isAuthenticated && <Header />}
      {children}
    </>
  );
};

export default AuthenticatedLayout;
