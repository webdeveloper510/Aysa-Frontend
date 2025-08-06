import { useState } from "react";
import { Tooltip } from "@mui/material";
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
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export const TabOne = () => {
  const [data, setData] = useState({ matched: [], compared: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setData({ matched: [], compared: [] });
      setSearchQuery("");
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    setError("");

    try {
      // Simulate API call for demo - replace with your actual API
      const response = await fetch(
        "https://api.the-aysa.com/product-semantic-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const matched = result.matched_data || [];
      const compared = result.compare_data || [];

      const formatItems = (items) =>
        items.map((item, index) => ({
          id: `${item["Brand"]}-${item["Product Name"]}-${index}`,
          brand: (item["Brand"] || "").trim(),
          product_name: (item["Product Name"] || "").trim(),
          product_type: (item["Type"] || "").trim(),
          production_year: parseInt(item["Production Year"]) || 0,
          profit_margin: item["Profit Margin"] || "0%",
          product_url: item["Link to Product Pictures"] || "",
          market_price: parseFloat(
            item["Release Price"]?.replace(/[^0-9.]/g, "") || "0"
          ),
          profit_made: parseFloat(
            item["Profit Made"]?.replace(/[^0-9.]/g, "") || "0"
          ),
        }));

      const matchedFormatted = formatItems(matched);
      const comparedFormatted = formatItems(compared);

      // Sort by production year (newest first)
      const sortedMatched = matchedFormatted.sort(
        (a, b) => b.production_year - a.production_year
      );

      setData({
        matched: sortedMatched,
        compared: comparedFormatted,
      });
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to load product data. Please try again.");
      setData({ matched: [], compared: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch(searchQuery);
    }
  };

  const firstProduct = data.matched?.[0] || {};

  const LoadingComponent = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
        Searching products...
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
        Analyzing profit margins and comparing products
      </Typography>
    </Box>
  );

  // const ProfitMarginCard = ({ product }) => {
  //   const profitMarginValue = parseFloat(product.profit_margin?.replace(/[^0-9.]/g, "") || "0");

  //   return (
  //     <Card elevation={3} sx={{ height: "100%" }}>
  //       <CardContent sx={{ textAlign: "center", py: 3 }}>
  //         <Typography variant="h6" fontWeight="bold" gutterBottom>
  //           Profit Margin Analysis
  //         </Typography>
  //         <Box
  //           sx={{
  //             fontSize: "3rem",
  //             fontWeight: "bold",
  //             color: profitMarginValue > 50 ? "#f44336" : profitMarginValue > 30 ? "#ff9800" : "#4caf50",
  //             my: 2
  //           }}
  //         >
  //           {product.profit_margin || "N/A"}
  //         </Box>
  //         <Typography variant="body2" color="text.secondary">
  //           * Estimated profit margin
  //         </Typography>
  //         {profitMarginValue > 50 && (
  //           <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
  //             High profit margin detected
  //           </Typography>
  //         )}
  //       </CardContent>
  //     </Card>
  //   );
  // };

  const profitMarginValue = parseFloat(
    firstProduct.profit_margin?.replace("%", "") || "0"
  );
  const marketPriceValue = firstProduct.market_price || 0;
  const profitValueMade = firstProduct.profit_made || 0;

  console.log(firstProduct);
const chartData = {
  labels: [`Profit $${profitValueMade}`, `Market Price $${marketPriceValue}`],
  datasets: [
    {
      label: "Profit Margin (%)",
      data: [profitMarginValue, null], // Only first bar
      backgroundColor: "#4FC3F7",
      yAxisID: "yLeft", // For percentage
      borderRadius: 6,
      barThickness: 40,
    },
    {
      label: "Market Price ($)",
      data: [null, marketPriceValue], // Only second bar
      backgroundColor: "#5C6BC0",
      yAxisID: "yRight", // For dollar value
      borderRadius: 6,
      barThickness: 40,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          if (context.dataset.label.includes("Margin")) {
            return `${context.raw}%`;
          }
          return `$${context.raw}`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Metrics",
        font: { weight: "bold" },
      },
    },
    yLeft: {
      type: "linear",
      position: "left",
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `${value}%`;
        },
      },
      title: {
        display: true,
        text: "Profit Margin (%)",
      },
    },
    yRight: {
      type: "linear",
      position: "right",
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `$${value}`;
        },
      },
      grid: {
        drawOnChartArea: false, // optional: hides overlapping grid lines
      },
      title: {
        display: true,
        text: "Market Price ($)",
      },
    },
  },
};

  return (
    <>
      <div class="meow">
        <Box m={3}>
          <Autocomplete
            freeSolo
            options={[]}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) =>
              setSearchQuery(newInputValue)
            }
            onKeyDown={handleKeyPress}
            disabled={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="See what brands don't want you to know…"
                variant="outlined"
                placeholder="Type product name (e.g., iPhone 14 Pro Max)..."
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    params.InputProps.endAdornment
                  ),
                }}
              />
            )}
          />
        </Box>
      </div>

      {loading && <LoadingComponent />}

      {error && (
        <Box textAlign="center" my={4}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      )}

      {!loading &&
        searchQuery &&
        !data.matched.length &&
        !data.compared.length &&
        !error && (
          <Box textAlign="center" my={6}>
            <Typography variant="h6" color="text.secondary">
              No products found for "{searchQuery}"
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Try searching for popular brands like "iPhone", "Samsung Galaxy",
              or "MacBook"
            </Typography>
          </Box>
        )}

      {!loading && data.matched.length > 0 && (
        <>
          <Typography variant="h4" align="center" fontWeight="bold" my={4}>
            {firstProduct.brand} {firstProduct.product_name}{" "}
            {firstProduct.product_type} ({firstProduct.production_year})
          </Typography>

          {/* <Typography variant="subtitle1" align="center" color="text.secondary" mb={4}>
            Production Year: {firstProduct.production_year}
          </Typography> */}

          <Box
            display="flex"
            flexWrap="wrap"
            gap={3}
            justifyContent="center"
            my={4}
          >
            <Box flex={1} maxWidth="400px" minWidth="300px">
              {firstProduct.product_url ? (
                <Box textAlign="center">
                  <img
                    src={firstProduct.product_url}
                    alt={`${firstProduct.brand} ${firstProduct.product_name}`}
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      height: "auto",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.disabled">
                    No image available
                  </Typography>
                </Box>
              )}
            </Box>

            {/* <Box flex={1} maxWidth="400px" minWidth="300px">
              <ProfitMarginCard product={firstProduct} />
            </Box> */}

            <Box flex={1} maxWidth="45%" height={300}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle1" fontWeight="bold" mr={0.5}>
                  Profit Margin: {firstProduct.profit_margin || "N/A"}
                </Typography>
                <Tooltip title="An estimate" arrow>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      Color: "#000",
                    }}
                  >
                    (*)
                  </Typography>
                </Tooltip>
              </Box>
              {chartData && <Bar data={chartData} options={chartOptions} />}
            </Box>
          </Box>

          <Typography
            variant="h5"
            align="center"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              py: 2,
              mt: 6,
              mb: 0,
              fontWeight: "bold",
            }}
          >
            {data.compared.length > 0
              ? `Product Comparison (${
                  data.matched.length + data.compared.length
                } products found)`
              : `Product Details (${data.matched.length} products found)`}
          </Typography>

          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#bbdefb" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Product Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Profit Margin
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Matched products */}
                {data.matched.map((row) => {
                  const allData = [...data.matched, ...data.compared];
                  const allMargins = allData.map((d) =>
                    parseFloat(d.profit_margin?.replace(/[^0-9.]/g, "") || "0")
                  );
                  const currentMargin = parseFloat(
                    row.profit_margin?.replace(/[^0-9.]/g, "") || "0"
                  );
                  const isMax = currentMargin === Math.max(...allMargins);
                  const isMin =
                    allMargins.length > 1 &&
                    currentMargin === Math.min(...allMargins);

                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        backgroundColor: isMax
                          ? "#ffebee"
                          : isMin
                          ? "#e8f5e8"
                          : "inherit",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>
                        {row.brand}
                      </TableCell>
                      <TableCell>
                        {row.product_url ? (
                          <img
                            src={row.product_url}
                            alt={`${row.brand} ${row.product_name}`}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+";
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              backgroundColor: "#f0f0f0",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="caption" color="text.disabled">
                              No img
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.product_type}</TableCell>
                      <TableCell>{row.production_year}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            fontWeight: "bold",
                            color: currentMargin > 50 ? "#f44336" : "inherit",
                          }}
                        >
                          {row.profit_margin}
                          {/* {isMax && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ ml: 1 }}
                            >
                              HIGHEST
                            </Typography>
                          )}
                          {isMin && (
                            <Typography
                              variant="caption"
                              color="success.main"
                              sx={{ ml: 1 }}
                            >
                              LOWEST
                            </Typography>
                          )} */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Compared products */}
                {data.compared.map((row) => {
                  const allData = [...data.matched, ...data.compared];
                  const allMargins = allData.map((d) =>
                    parseFloat(d.profit_margin?.replace(/[^0-9.]/g, "") || "0")
                  );
                  const currentMargin = parseFloat(
                    row.profit_margin?.replace(/[^0-9.]/g, "") || "0"
                  );
                  const isMax = currentMargin === Math.max(...allMargins);
                  const isMin =
                    allMargins.length > 1 &&
                    currentMargin === Math.min(...allMargins);

                  return (
                    <TableRow
                      key={`compared-${row.brand}-${row.product_name}`}
                      sx={{
                        backgroundColor: isMax
                          ? "#ffebee"
                          : isMin
                          ? "#e8f5e8"
                          : "#f9f9f9",
                        borderLeft: "4px solid #2196f3",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>
                        {row.brand}
                      </TableCell>
                      <TableCell>
                        {row.product_url ? (
                          <img
                            src={row.product_url}
                            alt={`${row.brand} ${row.product_name}`}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+";
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              backgroundColor: "#f0f0f0",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="caption" color="text.disabled">
                              No img
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.product_type}</TableCell>
                      <TableCell>{row.production_year}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            fontWeight: "bold",
                            color: currentMargin > 50 ? "#f44336" : "inherit",
                          }}
                        >
                          {row.profit_margin}
                          {/* {isMax && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ ml: 1 }}
                            >
                              HIGHEST
                            </Typography>
                          )}
                          {isMin && (
                            <Typography
                              variant="caption"
                              color="success.main"
                              sx={{ ml: 1 }}
                            >
                              LOWEST
                            </Typography>
                          )} */}
                        </Box>
                      </TableCell>
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
