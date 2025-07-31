import { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import axios from "axios";
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
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSearch = async (query) => {
  setSearchQuery(query);

  if (!query.trim()) {
    setFilteredData([]);
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await axios.post("https://api.the-aysa.com/tax-semantic-search", {
      query: query,
    });

    const rawRows = res.data?.result || [];

    const rows = rawRows.map((row) => ({
      company_name: row["Company Name"]?.trim(),
      year: row["Year"]?.trim(),
      tax_paid: row["Tax Paid"]?.trim(),
      tax_avoid: row["Tax Avoided"]?.trim(),
    }));

    setAllData(rows);

    const filtered = rows.filter(
      (row) =>
        row.company_name?.toLowerCase().includes(query.toLowerCase()) ||
        row.year?.toString().includes(query)
    );

    const sorted = [...filtered]
      .filter((row) => row.year)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));

    const topFourYears = sorted.slice(0, 4);

    setFilteredData(topFourYears);
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
            label="Search by company name or year"
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
        <Typography
          align="center"
          color="textSecondary"
          my={4}
          dangerouslySetInnerHTML={{
            __html: `No Match found for <strong>${searchQuery
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}</strong>`,
          }}
        />
      )}

      {!!filteredData.length && (
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
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  Company <br /> Name
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  Year
                </Box>
                <Box
                  sx={{
                    ...cellStyle,
                    backgroundColor: "#15A271",
                    color: "#fff",
                  }}
                >
                  Tax Paid
                </Box>
                <Box
                  sx={{
                    ...cellStyle,
                    backgroundColor: "#EC4137",
                    color: "#fff",
                  }}
                >
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
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.company_name}</Typography>
                  </Box>
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.year}</Typography>
                  </Box>
                  <Box
                    sx={{
                      ...cellStyle,
                      backgroundColor: "#E9E7CA",
                      color: "#0C7E57",
                    }}
                  >
                    <Typography variant="h6">{row.tax_paid}</Typography>
                  </Box>
                  <Box
                    sx={{
                      ...cellStyle,
                      backgroundColor: "#FEC7C7",
                      color: "#EC4137",
                    }}
                  >
                    <Typography variant="h6">{row.tax_avoid}</Typography>
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
