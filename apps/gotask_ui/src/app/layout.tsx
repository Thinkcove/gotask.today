import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import SWRProvider from "./provider/swrProvider";
import { UserProvider } from "./userContext";
import AuthenticatedLayout from "./authenticatedLayout";
import { theme } from "./theme/theme";

export const metadata: Metadata = {
  title: "Go Task Today",
  description: "Seamless Workflow Management"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ overflow: "hidden" }}>
        <UserProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <SWRProvider>
                <AuthenticatedLayout>{children}</AuthenticatedLayout>
              </SWRProvider>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
