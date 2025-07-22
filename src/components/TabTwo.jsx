import { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";

const cellStyle = {
  padding: "20px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "1.2rem",
  wordBreak: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

export const TabTwo = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://api.the-aysa.com/ceo-worker-semantic-search")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setApiData(data?.data || []);
        setError("");
      })
      .catch((err) => {
        setError("Failed to load data.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredData = apiData.filter((row) =>
    row.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.ceo_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.ceo_total_compensation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.worker_salary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.year?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="meow">
      <Box m={3}>
        <TextField
          label="Search by company, CEO, or year"
          variant="outlined"
          className="input-form"
          placeholder="Type to filter..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      </div>

      {loading && <Typography align="center">Loading...</Typography>}
      {error && <Typography color="error" align="center">{error}</Typography>}

      <Box sx={{ p: 2 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: "750px" }}>
            {/* Header */}
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

            {/* Body */}
            {filteredData.map((row, index) => (
              <Box
                key={index}
                className="tablebody"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                }}
              >
                <Box sx={{ ...cellStyle, backgroundColor: "#FCD7BF" }}>
                  <Typography variant="h6">{row.company_name}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#E0ECE7" }}>
                  <Typography variant="h6">{row.year}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#E9E7CA" }}>
                  <Typography variant="h6">{row.ceo_name}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#FEC7C7" }}>
                  <Typography variant="h6">{row.ceo_total_compensation}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#D0F6B4" }}>
                  <Typography variant="h6">{row.worker_salary}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
