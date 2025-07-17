import React from "react";
import Search from "../Search";
import { Box, Typography } from "@mui/material";

const cellStyle = {
  padding: "20px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "1.2rem",
  wordBreak: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

const TabTwo = () => {
  const data = {
    company: "Nike",
    year: 2024,
    ceo: "Elliot Hill",
    compensation: "32.0 million",
    workerSalary: "$35,500.0",
  };

  return (
    <>
      <div className="search-form">
        {!window.location.pathname.endsWith("about/") && <Search />}
      </div>

      <Box sx={{ p: 2 }}>
        {/* ✅ Scrollable wrapper */}
        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: "750px" }}>
            {/* Header Row */}
            <Box
              className="tableheader"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
              }}
            >
              <Box sx={{ ...cellStyle, backgroundColor: "#F7C8AA" }}>
                Company <br /> Name
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#BCD7DC" }}>Year</Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#D3DCAA" }}>
                CEO <br /> Name
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#F69F9F" }}>
                CEO Total Compensation
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#A2D37F" }}>
                Frontline Worker Salary
              </Box>
            </Box>

            {/* Body Row */}
            <Box
              className="tablebody"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
              }}
            >
              <Box sx={{ ...cellStyle, backgroundColor: "#FCD7BF" }}>
                <Typography variant="h6">{data.company}</Typography>
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#E0ECE7" }}>
                <Typography variant="h6">{data.year}</Typography>
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#E9E7CA" }}>
                <Typography variant="h6">{data.ceo}</Typography>
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#FEC7C7" }}>
                <Typography variant="h6">{data.compensation}</Typography>
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#D0F6B4" }}>
                <Typography variant="h6">{data.workerSalary}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TabTwo;
