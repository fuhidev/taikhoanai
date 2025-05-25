import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

const LoadingScreen: React.FC = () => {
 return (
  <Box
   sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    p: 3,
   }}
  >
   <CircularProgress size={40} sx={{ mb: 2 }} />
   <Typography variant="body2" color="text.secondary">
    Đang tải...
   </Typography>
  </Box>
 );
};

export default LoadingScreen;
