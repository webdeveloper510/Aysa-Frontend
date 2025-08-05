import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

export const TabOne = () => {
  const [data, setData] = useState({ matched: [], compared: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setData({ matched: [], compared: [] });
      return;
    }

    setSearching(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.the-aysa.com/product-semantic-search",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const matched = response.data.matched_data || [];
      const compared = response.data.compare_data || [];

      const formatItems = (items) =>
        items.map((item) => ({
          brand: item["Brand"] || "",
          product_name: item["Product Name"] || "",
          product_type: item["Type"] || "",
          production_year: item["Production Year"] || 0,
          profit_margin: item["Profit Margin"] || "0%",
          product_url: item["Link to Product Pictures"] || "",
          profit_made: item["Profit Made"] || "",
          release_price: item["Release Price"] || "",
          combinedText: `${item["Brand"] || ""} ${item["Product Name"] || ""} ${item["Profit Margin"] || ""}`.toLowerCase(),
        }));

      const searchWords = query.toLowerCase().split(/\s+/);
      const matchedFormatted = formatItems(matched);
      const comparedFormatted = formatItems(compared);

      const filteredMatched = matchedFormatted.filter((item) =>
        searchWords.every((word) => item.combinedText.includes(word))
      );

      const sortedMatched = filteredMatched.sort((a, b) => b.production_year - a.production_year);

      setData({
        matched: sortedMatched,
        compared: comparedFormatted,
      });
    } catch (err) {
      console.error("POST request failed:", err);
      setError("Failed to load product data.");
    } finally {
      setSearching(false);
    }
  };

  let first = data.matched?.[0] || {};

  const parseCurrency = (val) =>
    parseFloat(val?.replace(/[^0-9.]/g, "") || "0");

  const production = parseCurrency(first.profit_made);
  const market = parseCurrency(first.release_price);
  const profit = market - production;

  const chartData = {
    labels: [`Market Price: $${market}`],
    datasets: [
      {
        label: `Profit: $${profit}`,
        data: [profit],
        backgroundColor: "#4FC3F7",
      },
      {
        label: `Production Cost: $${production}`,
        data: [production],
        backgroundColor: "#5C6BC0",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: "bottom" },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: `Market Price: $${market || "N/A"}`,
          font: {
            size: 14,
          },
          padding: {
            top: 10,
          },
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        min: 0,
        max: 250,
        ticks: {
          stepSize: 50,
        },
        grid: {
          drawBorder: false,
          color: "#e0e0e0",
        },
      },
    },
  };



  return (
    <>
      <Box m={3}>
        <Autocomplete
          freeSolo
          options={[]} // No suggestions
          inputValue={searchQuery}
          onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="See what brands don't want you to know…"
              variant="outlined"
              placeholder="Type product name..."
              fullWidth
            />
          )}
        />
      </Box>

      {!loading && !searching && searchQuery && !data.matched.length && !data.compared.length && (
        <Typography align="center" color="textSecondary" my={4}>
          No match found for "<strong>{searchQuery}</strong>"
        </Typography>
      )}

      {loading && <Typography align="center">Loading...</Typography>}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!!data.matched.length && (
        <>
          <Typography variant="h5" align="center" fontWeight="bold" my={5}>
            {first.brand} {first.product_name} {first.production_year}
          </Typography>

          <Box display="flex" flexWrap="wrap" justifyContent="space-between" my={4}>
            <Box flex={1} maxWidth="45%" mb={2}>
              {first.product_url && (
                <img
                  src={first.product_url}
                  alt={first.product_name || "Product"}
                  style={{ width: 200, height: "auto", borderRadius: "8px" }}
                />
              )}
            </Box>
            <Box flex={1} maxWidth="45%">
              <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                className="chart-heading"
              >
                Profit Margin: {first.profit_margin || "N/A"}{" "}
                <Tooltip title="An estimate">
                  <span style={{ cursor: "pointer" }}>(*)</span>
                </Tooltip>
              </Typography>

              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Box>

          <Typography
            variant="h6"
            align="center"
            sx={{ backgroundColor: "black", color: "white", py: 1, mt: 4 }}
          >
            {data.compared.length > 0 
              ? "Comparing the profit margin to other similar products" 
              : "Product Details"}
          </Typography>

          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#b3e5fc" }}>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>Product Picture</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Profit Margin</TableCell>
                  <TableCell>Product Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* First show matched products */}
                {data.matched.map((row, idx) => {
                  const allData = [...data.matched, ...data.compared];
                  const allMargins = allData.map((d) =>
                    parseFloat(d.profit_margin?.replace(/[^0-9.]/g, "") || "0")
                  );
                  const currentMargin = parseFloat(
                    row.profit_margin?.replace(/[^0-9.]/g, "") || "0"
                  );
                  const isMax = currentMargin === Math.max(...allMargins);
                  const isMin = currentMargin === Math.min(...allMargins);

                  return (
                    <TableRow
                      key={`matched-${row.product_name || idx}`}
                      sx={{
                        backgroundColor: isMax
                          ? "#dcedc8"
                          : isMin
                          ? "#ffcdd2"
                          : "inherit",
                      }}
                    >
                      <TableCell>{row.brand}</TableCell>
                      <TableCell>
                        {row.product_url && (
                          <img
                            src={row.product_url}
                            alt={row.product_name || "Product"}
                            style={{ width: 80, height: "auto", borderRadius: "4px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.profit_margin}</TableCell>
                      <TableCell>{row.product_type}</TableCell>
                    </TableRow>
                  );
                })}
                
                {/* Then show compared products if they exist */}
                {data.compared.map((row, idx) => {
                  const allData = [...data.matched, ...data.compared];
                  const allMargins = allData.map((d) =>
                    parseFloat(d.profit_margin?.replace(/[^0-9.]/g, "") || "0")
                  );
                  const currentMargin = parseFloat(
                    row.profit_margin?.replace(/[^0-9.]/g, "") || "0"
                  );
                  const isMax = currentMargin === Math.max(...allMargins);
                  const isMin = currentMargin === Math.min(...allMargins);

                  return (
                    <TableRow
                      key={`compared-${row.product_name || idx}`}
                      sx={{
                        backgroundColor: isMax
                          ? "#dcedc8"
                          : isMin
                          ? "#ffcdd2"
                          : "inherit",
                      }}
                    >
                      <TableCell>{row.brand}</TableCell>
                      <TableCell>
                        {row.product_url && (
                          <img
                            src={row.product_url}
                            alt={row.product_name || "Product"}
                            style={{ width: 80, height: "auto", borderRadius: "4px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.profit_margin}</TableCell>
                      <TableCell>{row.product_type}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </>
  );
};