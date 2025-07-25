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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setData([]);
      return;
    }

    setLoading(true);
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

      // ✅ STEP 1: Match product by partial name
      const matchedProduct = withParsed.find((item) =>
        item.product_name?.toLowerCase().includes(query.toLowerCase())
      );

      if (!matchedProduct) {
        setData([]);
        return;
      }

      const matchedMargin = matchedProduct.parsedMargin;

      // ✅ STEP 2: Find lowest margin excluding same margin as matched
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

      // ✅ STEP 3: Find highest margin excluding same margin as matched
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

      // ✅ STEP 4: Build final list (no duplicates)
      const finalData = [matchedProduct];

      if (
        lowest &&
        lowest.product_name !== matchedProduct.product_name &&
        !finalData.find((i) => i.product_name === lowest.product_name)
      ) {
        finalData.push(lowest);
      }

      if (
        highest &&
        highest.product_name !== matchedProduct.product_name &&
        !finalData.find((i) => i.product_name === highest.product_name)
      ) {
        finalData.push(highest);
      }

      console.log("Matched:", matchedProduct);
      console.log("Lowest margin product (excluding matched margin):", lowest);
      console.log(
        "Highest margin product (excluding matched margin):",
        highest
      );
      console.log(
        "Final Data:",
        finalData.map((x) => x.product_name)
      );

      setData(finalData);
    } catch (err) {
      console.error("GET request failed:", err);
      setError("Failed to load product data.");
    } finally {
      setLoading(false);
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
            options={[]} // no suggestions yet
            inputValue={searchQuery}
            onInputChange={(e, newInput) => handleSearch(newInput)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="See what brands don’t want you to know…"
                className="input-form"
                variant="outlined"
                placeholder="Search by product name, brand, or profit margin"
                fullWidth
              />
            )}
          />
        </Box>
      </div>

      {!loading && searchQuery && data.length === 0 && (
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
