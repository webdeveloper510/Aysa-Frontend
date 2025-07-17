import React from "react";
import Search from "../Search";
import { Box, Typography } from "@mui/material";

const cellStyle = {
  padding: "20px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "1.2rem",
  borderRadius: "6px",
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
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
          }}
        >
          <Box sx={{ ...cellStyle, backgroundColor: "#ffccbc" }}>
            Company Name
          </Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#cfd8dc" }}>Year</Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#e6ee9c" }}>CEO Name</Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#f8bbd0" }}>
            CEO Total Compensation
          </Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#c8e6c9" }}>
            Frontline Worker Salary
          </Box>
        </Box>

        {/* Value Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
          }}
        >
          <Box sx={{ ...cellStyle, backgroundColor: "#ffccbc" }}>
            <Typography variant="h6">{data.company}</Typography>
          </Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#cfd8dc" }}>
            <Typography variant="h6">{data.year}</Typography>
          </Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#e6ee9c" }}>
            <Typography variant="h6">{data.ceo}</Typography>
          </Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#f8bbd0" }}>
            <Typography variant="h6">{data.compensation}</Typography>
          </Box>
          <Box sx={{ ...cellStyle, backgroundColor: "#c8e6c9" }}>
            <Typography variant="h6">{data.workerSalary}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TabTwo;
