import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, CssBaseline } from "@mui/material";
import SWRProvider from "./provider/swrProvider";
import Header from "./component/header";

export const metadata: Metadata = {
  title: "Go Task Today",
  description: "Seamless workflow Management",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ overflow: "hidden", backgroundColor: "#E1D7E0" }}>
        <CssBaseline />

        {/* Fixed Header */}
        <Header />

        {/* Main Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            {/* Scrollable Content Below Header */}
            <Box
              sx={{
                flexGrow: 1,
                paddingTop: "70px",
              }}
            >
              <SWRProvider>{children}</SWRProvider>
            </Box>
          </AppRouterCacheProvider>
        </Box>
      </body>
    </html>
  );
}
