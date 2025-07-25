import { useState } from "react";
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
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setFilteredData([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://api.the-aysa.com/ceo-worker-semantic-search"
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      const data = result?.data || [];

      setAllData(data);

      const filtered = data.filter(
        (row) =>
          row.company_name?.toLowerCase().includes(value.toLowerCase()) ||
          row.ceo_name?.toLowerCase().includes(value.toLowerCase())
        // row.ceo_total_compensation
        //   ?.toLowerCase()
        //   .includes(value.toLowerCase()) ||
        // row.worker_salary?.toLowerCase().includes(value.toLowerCase()) ||
        // row.year?.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredData(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="meow">
        <Box m={3}>
          <TextField
            label="Search by company or CEO name"
            variant="outlined"
            className="input-form"
            placeholder="Type to filter..."
            fullWidth
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
      </div>

      {loading && <Typography align="center">Loading...</Typography>}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      {!loading && searchQuery && filteredData.length === 0 && (
        <Typography align="center" color="textSecondary" my={4}>
          No data found for "<strong>{searchQuery}</strong>"
        </Typography>
      )}

      {!!filteredData.length && (
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
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  Company <br /> Name
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  Year
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#D3DCAA" }}>
                  CEO <br /> Name
                </Box>
                <Box
                  sx={{
                    ...cellStyle,
                    backgroundColor: "#EC4137",
                    color: "#fff",
                  }}
                >
                  CEO Total Compensation
                </Box>
                <Box
                  sx={{
                    ...cellStyle,
                    backgroundColor: "#FF0000",
                    color: "#fff",
                  }}
                >
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
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.company_name}</Typography>
                  </Box>
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.year}</Typography>
                  </Box>
                  <Box sx={{ ...cellStyle, backgroundColor: "#E9E7CA" }}>
                    <Typography variant="h6">{row.ceo_name}</Typography>
                  </Box>
                  <Box
                    sx={{
                      ...cellStyle,
                      backgroundColor: "#EC4137",
                      color: "#fff",
                    }}
                  >
                    <Typography variant="h6">
                      {row.ceo_total_compensation}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ...cellStyle,
                      backgroundColor: "#FF0000",
                      color: "#fff",
                    }}
                  >
                    <Typography variant="h6">{row.worker_salary}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
