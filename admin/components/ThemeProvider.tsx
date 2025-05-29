"use client";

import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
 palette: {
  mode: "light",
  primary: {
   main: "#1976d2",
  },
 },
});

export default function CustomThemeProvider({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <MuiThemeProvider theme={theme}>
   <CssBaseline />
   {children}
  </MuiThemeProvider>
 );
}
