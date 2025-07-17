import React from "react";
import Search from "../Search";
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
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const TabOne = () => {
  const chartData = {
    labels: ["Market Price", "Production Cost", "Profit"],
    datasets: [
      {
        label: "USD",
        data: [200, 170, 30],
        backgroundColor: ["#1976d2", "#64b5f6", "#81c784"],
      },
    ],
  };

  const tableRows = [
    {
      brand: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      image: "https://cdn.flightclub.com/2600/TEMPLATE/307078/1.jpg",
      name: "Air Jordan 5",
      margin: "65%",
    },
    {
      brand: "Asics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      image:
        "https://images.asics.com/is/image/asics/1201A789_102_SR_RT_GLB?$zoom$",
      name: "GEL-NYC",
      margin: "52%",
    },
    {
      brand: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      image:
        "https://images.asics.com/is/image/asics/1201A789_102_SR_RT_GLB?$zoom$",
      name: "Adios Pro",
      margin: "60%",
    },
  ];

  return (
    <>
      <div className="search-form">
        {!window.location.pathname.endsWith("about/") && <Search />}
      </div>

      <Typography variant="h5" align="center" fontWeight="bold" my={5}>
        Nike Air Jordan 5 (2024)
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        my={4}
        mb={5}
      >
        <Box flex={1} maxWidth="45%" mb={2}>
          <img src={Productimage} alt="Air Jordan 5" style={{ width: "50%" }} />
        </Box>

        <Box flex={1} maxWidth="45%">
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Profit Margin: 15%(↑)
          </Typography>
          <Bar data={chartData} />
        </Box>
      </Box>

      <Typography
        variant="h6"
        align="center"
        sx={{ backgroundColor: "black", color: "white", py: 1 }}
      >
        Comparing the Nike profit margin to the below similar products
      </Typography>

      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#b3e5fc" }}>
            <TableRow className="Table-head">
              <TableCell>Brand Name</TableCell>
              <TableCell>Product Picture</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Profit Margin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, idx) => (
              <TableRow key={idx} className="Table-row">
                <TableCell>
                  <img src={row.logo} alt={row.brand} width="60" />
                </TableCell>
                <TableCell>
                  <img src={row.image} alt={row.name} width="80" />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.margin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default TabOne;
