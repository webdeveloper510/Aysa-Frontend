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
      const response = await axios.get("https://api.the-aysa.com/product-semantic-search");
      const allItems = response.data.data || [];

      const filtered = allItems.filter(
        (item) =>
          item.product_name?.toLowerCase().includes(query.toLowerCase()) ||
          item.brand?.toLowerCase().includes(query.toLowerCase()) ||
          item.profit_margin?.toLowerCase().includes(query.toLowerCase())
      );

      setData(filtered);
    } catch (err) {
      console.error("GET request failed:", err);
      setError("Failed to load product data.");
    } finally {
      setLoading(false);
    }
  };

  const first = data[0] || {};
  const parseCurrency = (val) => parseFloat(val?.replace(/[^0-9.]/g, "") || "0");

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
          options={[]} // No suggestions initially
          inputValue={searchQuery}
          onInputChange={(e, newInput) => handleSearch(newInput)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by brand or product name"
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

          <Box display="flex" flexWrap="wrap" justifyContent="space-between" my={4}>
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
                {data.map((row, idx) => (
                  <TableRow key={row.product_name || idx} className="Table-row">
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
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </>
  );
};
