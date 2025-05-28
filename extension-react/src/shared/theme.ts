// Theme configuration for consistent styling across the extension
export const theme = {
 colors: {
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
  success: {
   main: "#e3ff3c",
   contrastText: "#000000",
  },
  error: {
   main: "#f44336",
   contrastText: "#ffffff",
  },
  warning: {
   main: "#4640be",
   contrastText: "#ffffff",
  },
  background: {
   default: "#fafafa",
   paper: "#ffffff",
  },
  text: {
   primary: "#333333",
   secondary: "#666666",
  },
 },
 spacing: {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
 },
 borderRadius: {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
 },
 shadows: {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
 },
};

export type Theme = typeof theme;
