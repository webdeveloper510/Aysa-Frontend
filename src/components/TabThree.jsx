import { useState } from "react";
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

export const TabThree = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearchResult = (data) => {
    if (!data || typeof data !== "object") {
      setError("No results found.");
      return;
    }
    setApiData(data);
    setError("");
  };

  const fallbackData = {
    company: "Amazon",
    year: 2024,
    taxpaid: "$2.1 billion",
    taxavoided: "$5.4 billion",
  };

  const data = apiData?.results?.[0] || fallbackData;

  return (
    <>
      <div className="search-form">
        {!window.location.pathname.endsWith("about/") && (
          <Search apiType="ceo" onProductSelect={handleSearchResult} />
        )}
      </div>

      {loading && <Typography align="center">Loading...</Typography>}
      {error && <Typography color="error" align="center">{error}</Typography>}

      <Box sx={{ p: 4, display: "flex", flexDirection: "column" }}>
        <Box className="tab3Table" sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: "750px" }}>
            {/* Header Row */}
            <Box
              className="tableheader"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 1,
              }}
            >
              <Box sx={{ ...cellStyle, backgroundColor: "#F99B33" }}>
                Company <br /> Name
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#F99B33" }}>Year</Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#15A271", color: "#fff" }}>
                Tax Paid
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#EC4137", color: "#fff" }}>
                Tax Avoided
              </Box>
            </Box>

            {/* Body Row */}
            <Box
              className="tablebody"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 1,
              }}
            >
              <Box sx={{ ...cellStyle, backgroundColor: "#FCD7BF" }}>
                <Typography variant="h6">{data.company}</Typography>
              </Box>
              <Box sx={{ ...cellStyle, backgroundColor: "#E0ECE7" }}>
                <Typography variant="h6">{data.year}</Typography>
              </Box>
              <Box
                sx={{
                  ...cellStyle,
                  backgroundColor: "#E9E7CA",
                  color: "#0C7E57",
                }}
              >
                <Typography variant="h6">{data.taxpaid}</Typography>
              </Box>
              <Box
                sx={{
                  ...cellStyle,
                  backgroundColor: "#FEC7C7",
                  color: "#EC4137",
                }}
              >
                <Typography variant="h6">{data.taxavoided}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
