import { useEffect, useState } from "react";
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

  
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.the-aysa.com/product-semantic-search"
        );
        const items = response.data.data || [];
        setData(items);
      } catch (err) {
        console.error("GET request failed:", err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);


  const filteredData = data.filter(
    (item) =>
      item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.profit_margin?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const first = filteredData[0] || {};

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
      legend: {
        position: "bottom",
      },
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
        title: {
          display: true,
          text: "Market Price",
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

 
// const suggestions = data
//   .filter((item) =>
//     item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.profit_margin?.toLowerCase().includes(searchQuery.toLowerCase())
//   )
//   .map((item) => `${item.brand} - ${item.product_name} - ${item.profit_margin}`)
//   .slice(0, 10); // optional: limit to top 10 suggestions


const suggestions = [...new Set(data.map((item) => item.product_name || ""))];


  return (
    <>
      <div className="meow">
        <Box m={3}>
          <Autocomplete
  freeSolo
  options={suggestions}
  inputValue={searchQuery}
  onInputChange={(e, newInput) => setSearchQuery(newInput)}
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

      {loading && <Typography align="center">Loading...</Typography>}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

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
            {filteredData.map((row, idx) => (
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
  );
};
