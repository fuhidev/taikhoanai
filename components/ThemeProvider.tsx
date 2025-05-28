"use client";

import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
 palette: {
  mode: "light",
  primary: {
   main: "#e3ff3c",
   dark: "#d4f020",
   light: "#eaff6b",
   contrastText: "#000000",
  },
  secondary: {
   main: "#4640be",
   dark: "#3429a3",
   light: "#6b65d3",
   contrastText: "#ffffff",
  },
  background: {
   default: "#fafafa",
   paper: "#ffffff",
  },
 },
 typography: {
  allVariants: {
   color: "#333333",
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
