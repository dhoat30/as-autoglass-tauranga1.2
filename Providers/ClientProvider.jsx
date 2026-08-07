"use client";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "../utils/themeSettings";
import LoadingIndicator from "@/Components/UI/Loader/LoadingIndicator";
export default function ClientProvider({ children }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <LoadingIndicator />
      {children}
    </ThemeProvider>
  );
}
