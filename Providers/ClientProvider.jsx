"use client";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { lightTheme } from "../utils/themeSettings";
import LoadingIndicator from "@/Components/UI/Loader/LoadingIndicator";
export default function ClientProvider({ children }) {
  return (
    // Flushes Emotion's styles into <head> during SSR. Without it they render
    // inline in the body and the client tree no longer matches the server HTML.
    <AppRouterCacheProvider options={{ key: "mui", prepend: true }}>
      <ThemeProvider theme={lightTheme}>
        <LoadingIndicator />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
