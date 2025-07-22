import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
    className="footerrow"
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2C2C2C", // Dark background
        borderTop: "3px solid white",
        padding: "12px 24px",
        fontFamily: "inherit",
      }}
    >
      <Link to="/about" style={{ color: "#00AEEF", textDecoration: "none" }}>
        About us
      </Link>

      <Typography
        component="a"
        href="mailto:contact@the-aysa.com"
        sx={{
          color: "#00AEEF",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Contact us
      </Typography>
    </Box>
  );
};
