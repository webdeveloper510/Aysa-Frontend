import { useState } from "react";
import Productimage from "../assets/image/product-image.png";
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
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query, isSelection = false) => {
    setSearchQuery(query);
    if (!query) {
      setSuggestions([]);
      setData([]);
      return;
    }

    setSearching(true); // prevent "No data found" flicker

    try {
      const response = await axios.get(
        "https://api.the-aysa.com/product-semantic-search"
      );
      const allItems = response.data.data || [];

      const withParsed = allItems.map((item) => ({
        ...item,
        parsedMargin: parseFloat(
          item.profit_margin?.replace(/[^0-9.]/g, "") || "0"
        ),
      }));

      // 🔍 Autocomplete suggestions while typing
      if (!isSelection) {
        const matches = withParsed.filter((item) =>
          item.product_name?.toLowerCase().includes(query.toLowerCase())
        );

        setSuggestions(matches.slice(0, 10)); // limit suggestions
        setSearching(false);
        return;
      }

      // ✅ ON USER SELECT FROM SUGGESTIONS
      const matchedProduct = withParsed.find(
        (item) =>
          item.product_name?.toLowerCase().trim() === query.toLowerCase().trim()
      );

      if (!matchedProduct) {
        setData([]);
        setSearching(false);
        return;
      }

      const matchedMargin = matchedProduct.parsedMargin;

      const lowest = withParsed
        .filter(
          (item) =>
            item.product_name !== matchedProduct.product_name &&
            item.parsedMargin < matchedMargin
        )
        .reduce(
          (min, item) => (item.parsedMargin < min.parsedMargin ? item : min),
          withParsed.find((x) => x.parsedMargin < matchedMargin) ||
            matchedProduct
        );

      const highest = withParsed
        .filter(
          (item) =>
            item.product_name !== matchedProduct.product_name &&
            item.parsedMargin > matchedMargin
        )
        .reduce(
          (max, item) => (item.parsedMargin > max.parsedMargin ? item : max),
          withParsed.find((x) => x.parsedMargin > matchedMargin) ||
            matchedProduct
        );

      const finalData = [matchedProduct];
      if (lowest && lowest.product_name !== matchedProduct.product_name) {
        finalData.push(lowest);
      }
      if (
        highest &&
        highest.product_name !== matchedProduct.product_name &&
        highest.product_name !== lowest.product_name
      ) {
        finalData.push(highest);
      }

      setSuggestions([]);
      setData(finalData);
    } catch (err) {
      console.error("GET request failed:", err);
      setError("Failed to load product data.");
    } finally {
      setSearching(false); // always stop searching
    }
  };

  let first = data[0] || {};

  if (!isNaN(searchQuery)) {
    const targetMargin = parseFloat(searchQuery);
    const exactMatch = data.find(
      (item) =>
        parseFloat(item.profit_margin?.replace(/[^0-9.]/g, "") || "0") ===
        targetMargin
    );
    if (exactMatch) first = exactMatch;
  } else {
    const partialMatch = data.find((item) =>
      item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (partialMatch) first = partialMatch;
  }

  const parseCurrency = (val) =>
    parseFloat(val?.replace(/[^0-9.]/g, "") || "0");

  const production = parseCurrency(first.profit_made);
  const market = parseCurrency(first.profit_price);
  const profit = market - production;

  const chartData = {
    labels: [`Market Price: $${market}`],
    datasets: [
      {
        label: `Production Cost: $${production}`,
        data: [production],
        backgroundColor: "#5C6BC0",
      },
      {
        label: `Profit: $${profit}`,
        data: [profit],
        backgroundColor: "#4FC3F7",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: `Profit Margin: ${first.profit_margin || "N/A"} (*)`,
        font: { size: 18, weight: "bold" },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "Market Price" },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div className="meow">
        <Box m={3}>
          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.product_name} (Profit: ${option.profit_margin})`
            }
            inputValue={searchQuery}
            onInputChange={(e, newInput) => handleSearch(newInput)}
            onChange={(e, selectedOption) => {
              if (selectedOption?.product_name) {
                handleSearch(selectedOption.product_name, true); // true = selected
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.product_name}>
                <Box display="flex" flexDirection="column">
                  <Typography fontWeight="bold">
                    {option.product_name}
                  </Typography>
                  <Typography fontSize={12} color="gray">
                    Profit Margin: {option.profit_margin}
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="See what brands don’t want you to know…"
                variant="outlined"
                placeholder="Type product name..."
                fullWidth
              />
            )}
          />
        </Box>
      </div>

      {!loading && !searching && searchQuery && data.length === 0 && (
        <Typography align="center" color="textSecondary" my={4}>
          No data found for "<strong>{searchQuery}</strong>"
        </Typography>
      )}

      {loading && <Typography align="center">Loading...</Typography>}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!!data.length && (
        <>
          <Typography variant="h5" align="center" fontWeight="bold" my={5}>
            {first.brand} {first.product_name} {first.year}
          </Typography>

          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            my={4}
          >
            <Box flex={1} maxWidth="45%" mb={2}>
              <img
                src={
                  first &&
                  first.product_url &&
                  first.product_url.trim().startsWith("http")
                    ? first.product_url
                    : Productimage
                }
                alt={first?.product_name || "Product"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Productimage;
                }}
                style={{ width: "100%", maxWidth: 300 }}
              />
            </Box>
            <Box flex={1} maxWidth="45%">
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Box>

          <Typography
            variant="h6"
            align="center"
            sx={{ backgroundColor: "black", color: "white", py: 1, mt: 4 }}
          >
            Comparing the profit margin to other similar products
          </Typography>

          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#b3e5fc" }}>
                <TableRow className="Table-head">
                  <TableCell>Brand</TableCell>
                  <TableCell>Product Picture</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Profit Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => {
                  const allMargins = data.map((d) =>
                    parseFloat(d.profit_margin?.replace(/[^0-9.]/g, "") || "0")
                  );
                  const currentMargin = parseFloat(
                    row.profit_margin?.replace(/[^0-9.]/g, "") || "0"
                  );
                  const isMax = currentMargin === Math.max(...allMargins);
                  const isMin = currentMargin === Math.min(...allMargins);

                  return (
                    <TableRow
                      key={row.product_name || idx}
                      className="Table-row"
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
                        <img
                          src={row.product_url || Productimage}
                          alt={row.product_name || "Product"}
                          style={{ width: 100, height: "auto" }}
                        />
                      </TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.profit_margin}</TableCell>
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
