import { useState, useEffect, useMemo } from "react";
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

export const TabOne = () => {
  const [data, setData] = useState({ matched: [], compared: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allProductsData, setAllProductsData] = useState([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  // Load all products data once when component mounts
  useEffect(() => {
    const fetchAllProductsData = async () => {
      setInitialDataLoading(true);
      try {
        const response = await fetch("https://api.the-aysa.com/get-profit-margin-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const apiData = result.data || [];
        
        // Format the data for suggestions
        const formattedData = apiData.map((item, index) => ({
          id: index,
          label: `${item.Brand} ${item["Product Name"]} ${item.Type}`,
          value: `${item.Brand} ${item["Product Name"]}`,
          brand: item.Brand,
          productName: item["Product Name"],
          type: item.Type,
          profitMargin: item["Profit Margin "] || "N/A",
          productionYear: item["Production Year "] || "N/A",
          image: item["Link to Product Pictures"] || "",
          // Store search text for filtering
          searchText: `${item.Brand} ${item["Product Name"]} ${item.Type}`.toLowerCase()
        }));

        setAllProductsData(formattedData);
      } catch (err) {
        console.error("Failed to fetch initial products data:", err);
        setError("Failed to load product data. Please refresh the page.");
      } finally {
        setInitialDataLoading(false);
      }
    };

    fetchAllProductsData();
  }, []);

  // Generate suggestions from local data
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2 || allProductsData.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const filteredSuggestions = allProductsData.filter(item => 
      item.searchText.includes(query)
    ).slice(0, 10); // Limit to 10 suggestions

    return filteredSuggestions;
  }, [searchQuery, allProductsData]);

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
      const response = await fetch("https://api.the-aysa.com/product-semantic-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        return new Error(`HTTP error! status: ${response.status}`);
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
        }));

      const matchedFormatted = formatItems(matched);
      const comparedFormatted = formatItems(compared);

      // Sort by production year (newest first)
      const sortedMatched = matchedFormatted.sort((a, b) => b.production_year - a.production_year);

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

  const handleSuggestionSelect = (event, value) => {
    if (value && typeof value === 'object') {
      const selectedQuery = value.value;
      setSearchQuery(selectedQuery);
      // Automatically trigger semantic search when product is selected from suggestions
      handleSearch(selectedQuery);
    } else if (typeof value === 'string') {
      setSearchQuery(value);
      // Also trigger search for manual text input
      handleSearch(value);
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

  const InitialLoadingComponent = () => (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={8}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
        Loading product 
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
        This may take a moment 
      </Typography>
    </Box>
  );

  const ProfitMarginCard = ({ product }) => {
    const profitMarginValue = parseFloat(product.profit_margin?.replace(/[^0-9.]/g, "") || "0");
    
    return (
      <Card elevation={3} sx={{ height: "100%" }}>
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Profit Margin Analysis
          </Typography>
          <Box 
            sx={{ 
              fontSize: "3rem", 
              fontWeight: "bold", 
              color: profitMarginValue > 50 ? "#f44336" : profitMarginValue > 30 ? "#ff9800" : "#4caf50",
              my: 2 
            }}
          >
            {product.profit_margin || "N/A"}
          </Box>
          <Typography variant="body2" color="text.secondary">
            * Estimated profit margin
          </Typography>
          {profitMarginValue > 50 && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
              High profit margin detected
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // Show initial loading screen while fetching all products data
  if (initialDataLoading) {
    return <InitialLoadingComponent />;
  }

  return (
    <>
      <Box m={3}>
        <Autocomplete
          freeSolo
          options={suggestions}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            return option.label || '';
          }}
          inputValue={searchQuery}
          onInputChange={(event, newInputValue) => {
            if (event && event.type === 'change') {
              setSearchQuery(newInputValue || "");
            }
          }}
          onChange={handleSuggestionSelect}
          onKeyDown={handleKeyPress}
          noOptionsText={searchQuery.length < 2 ? "Type at least 2 characters" : "No matching products found"}
          disabled={loading}
          filterOptions={(options) => options} // Disable built-in filtering since we handle it ourselves
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {option.image && (
                  <Box sx={{ mr: 2 }}>
                    <img 
                      src={option.image} 
                      alt={option.label}
                      style={{ 
                        width: 40, 
                        height: 40, 
                        objectFit: 'cover', 
                        borderRadius: '4px' 
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {option.brand} {option.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type} - {option.profitMargin} margin ({option.productionYear})
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={allProductsData.length > 0 ? "See what brands don't want you to know…" : "Loading products..."}
              variant="outlined"
              fullWidth
              disabled={loading || initialDataLoading}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {loading && <LoadingComponent />}

      {error && (
        <Box textAlign="center" my={4}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      )}

      {!loading && searchQuery && !data.matched.length && !data.compared.length && !error && (
        <Box textAlign="center" my={6}>
          <Typography variant="h6" color="text.secondary">
            No products found for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {!loading && data.matched.length > 0 && (
        <>
          <Typography variant="h4" align="center" fontWeight="bold" my={4}>
            {firstProduct.brand} {firstProduct.product_name} {firstProduct.product_type}
          </Typography>
          
          <Typography variant="subtitle1" align="center" color="text.secondary" mb={4}>
            Production Year: {firstProduct.production_year}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center" my={4}>
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
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
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
                    justifyContent: "center"
                  }}
                >
                  <Typography color="text.disabled">No image available</Typography>
                </Box>
              )}
            </Box>
            
            <Box flex={1} maxWidth="400px" minWidth="300px">
              <ProfitMarginCard product={firstProduct} />
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
              fontWeight: "bold"
            }}
          >
            {data.compared.length > 0 
              ? `Product Comparison (${data.matched.length + data.compared.length} products found)` 
              : `Product Details (${data.matched.length} products found)`}
          </Typography>

          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#bbdefb" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Profit Margin</TableCell>
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
                  const isMin = allMargins.length > 1 && currentMargin === Math.min(...allMargins);

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
                          backgroundColor: "#f5f5f5"
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>{row.brand}</TableCell>
                      <TableCell>
                        {row.product_url ? (
                          <img
                            src={row.product_url}
                            alt={`${row.brand} ${row.product_name}`}
                            style={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: "cover",
                              borderRadius: "6px" 
                            }}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
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
                              justifyContent: "center"
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
                        <Box sx={{ fontWeight: "bold", color: currentMargin > 50 ? "#f44336" : "inherit" }}>
                          {row.profit_margin}
                          {isMax && <Typography variant="caption" color="error" sx={{ ml: 1 }}>HIGHEST</Typography>}
                          {isMin && <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>LOWEST</Typography>}
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
                  const isMin = allMargins.length > 1 && currentMargin === Math.min(...allMargins);

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
                          backgroundColor: "#f0f0f0"
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>{row.brand}</TableCell>
                      <TableCell>
                        {row.product_url ? (
                          <img
                            src={row.product_url}
                            alt={`${row.brand} ${row.product_name}`}
                            style={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: "cover",
                              borderRadius: "6px" 
                            }}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
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
                              justifyContent: "center"
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
                        <Box sx={{ fontWeight: "bold", color: currentMargin > 50 ? "#f44336" : "inherit" }}>
                          {row.profit_margin}
                          {isMax && <Typography variant="caption" color="error" sx={{ ml: 1 }}>HIGHEST</Typography>}
                          {isMin && <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>LOWEST</Typography>}
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