import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import SWRProvider from "./provider/swrProvider";
import { UserProvider } from "./userContext";
import AuthenticatedLayout from "./authenticatedLayout";
import { theme } from "./theme/theme";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "Go Task Today",
  description: "Seamless Workflow Management"
};

const locale = await getLocale();
const messages = await getMessages();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale}>
      <body style={{ overflow: "hidden" }}>
        <UserProvider>
          <NextIntlClientProvider messages = {messages}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <SWRProvider>
                  <AuthenticatedLayout>{children}</AuthenticatedLayout>
                </SWRProvider>
              </AppRouterCacheProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}

