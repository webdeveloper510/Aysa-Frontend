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

export const TabThree = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://api.the-aysa.com/tax-semantic-search")
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
    row.year?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.tax_paid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.tax_avoid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="meow">
      <Box m={3}>
        <TextField
          label="Search tax data"
          variant="outlined"
          className="input-form"
          placeholder="Search by company, year, or tax figures"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      </div>

      {loading && <Typography align="center">Loading...</Typography>}
      {error && <Typography color="error" align="center">{error}</Typography>}

      <Box sx={{ p: 4, display: "flex", flexDirection: "column" }}>
        <Box className="tab3Table" sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: "750px" }}>
            {/* Header */}
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

            {/* Body */}
            {filteredData.map((row) => (
              <Box
                key={row.id}
                className="tablebody"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 1,
                }}
              >
                <Box sx={{ ...cellStyle, backgroundColor: "#FCD7BF" }}>
                  <Typography variant="h6">{row.company_name}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#E0ECE7" }}>
                  <Typography variant="h6">{row.year}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#E9E7CA", color: "#0C7E57" }}>
                  <Typography variant="h6">{row.tax_paid}</Typography>
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#FEC7C7", color: "#EC4137" }}>
                  <Typography variant="h6">{row.tax_avoid}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
