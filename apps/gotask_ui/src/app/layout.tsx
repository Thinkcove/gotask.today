import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, CssBaseline } from "@mui/material";
import SWRProvider from "./provider/swrProvider";
import { AuthProvider } from "./provider/authProvider";
import AuthenticatedLayout from "./authenticatedLayout";

export const metadata: Metadata = {
  title: "Go Task Today",
  description: "Seamless workflow Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ overflow: "hidden", backgroundColor: "#E1D7E0" }}>
        <CssBaseline />
        {/* Wrap the entire app inside AuthProvider */}
        <AuthProvider>
          <AuthenticatedLayout>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <SWRProvider>{children}</SWRProvider>
            </AppRouterCacheProvider>
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
