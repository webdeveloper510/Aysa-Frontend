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
  Tooltip,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export const TabOne = ({ searchLabel = "Search by brands, products or types" }) => {
  const [data, setData] = useState({ matched: [], compared: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allProductsData, setAllProductsData] = useState([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);

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
        console.log("Initial data fetch result:", result); 
        const apiData = result.data || [];
                const formattedData = apiData.map((item, index) => ({
          id: index,
          label: `${item.Brand || ''} ${item["Product Name"] || ''} ${item.Type || ''}`.trim(),
          value: `${item.Brand || ''} ${item["Product Name"] || ''} ${item.Type || ''}`.trim(),
          brand: item.Brand || '',
          productName: item["Product Name"] || '',
          type: item.Type || '',
          profitMargin: item["Profit Margin"] || item["Profit Margin "] || "N/A",
          productionYear: item["Production Year"] || item["Production Year "] || "N/A",
          image: item["Link to Product Pictures"] || "",
          searchText: [
            (item.Brand || '').toLowerCase(),
            (item["Product Name"] || '').toLowerCase(), 
            (item.Type || '').toLowerCase(),
            `${item.Brand || ''} ${item["Product Name"] || ''}`.toLowerCase(),
            `${item.Brand || ''} ${item.Type || ''}`.toLowerCase(),
            `${item["Product Name"] || ''} ${item.Type || ''}`.toLowerCase(),
            `${item.Brand || ''} ${item["Product Name"] || ''} ${item.Type || ''}`.toLowerCase()
          ].filter(text => text.trim() !== '') 
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

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1 || allProductsData.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(word => word.length > 0);
    
    const filteredSuggestions = allProductsData.filter(item => {
      const matchesFullQuery = item.searchText.some(text => text.includes(query));
      const matchesAllWords = queryWords.every(word => 
        item.searchText.some(text => text.includes(word))
      );
      
      const brand = item.brand.toLowerCase();
      const productName = item.productName.toLowerCase();
      const type = item.type.toLowerCase();
      
      const matchesIndividualFields = 
        brand.includes(query) || 
        productName.includes(query) || 
        type.includes(query) ||
        queryWords.some(word => 
          brand.includes(word) || 
          productName.includes(word) || 
          type.includes(word)
        );
      
      return matchesFullQuery || matchesAllWords || matchesIndividualFields;
    });

    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
      const aExactBrand = a.brand.toLowerCase() === query;
      const bExactBrand = b.brand.toLowerCase() === query;
      if (aExactBrand !== bExactBrand) return bExactBrand - aExactBrand;
      
      const aBrandStarts = a.brand.toLowerCase().startsWith(query);
      const bBrandStarts = b.brand.toLowerCase().startsWith(query);
      if (aBrandStarts !== bBrandStarts) return bBrandStarts - aBrandStarts;
      
      const aProductStarts = a.productName.toLowerCase().startsWith(query);
      const bProductStarts = b.productName.toLowerCase().startsWith(query);
      if (aProductStarts !== bProductStarts) return bProductStarts - aProductStarts;
            const aTypeStarts = a.type.toLowerCase().startsWith(query);
      const bTypeStarts = b.type.toLowerCase().startsWith(query);
      if (aTypeStarts !== bTypeStarts) return bTypeStarts - aTypeStarts;
            return a.brand.localeCompare(b.brand);
    });

    return sortedSuggestions.slice(0, 15);
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
      console.log("Making search request for:", query); 
      
      const response = await fetch("https://api.the-aysa.com/product-semantic-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const searchData = result.data || [];

        const formatItems = (items) => {
        if (!Array.isArray(items)) {
          console.warn("formatItems received non-array:", items);
          return [];
        }
        
        return items.map((item, index) => {
          const profitMargin = String(item["Profit Margin"] || item["Profit Margin "] || "0%");
          const profitMade = item["Profit Made"] || item["Profit Made "] || "$0";
          const releasePrice = item["Release Price"] || item["Release Price "] || "$0";
          const productionYear = item["Production Year"] || item["Production Year "] || 0;
          
          return {
            id: `${item["Brand"]}-${item["Product Name"]}-${index}`,
            brand: (item["Brand"] || "").trim(),
            product_name: (item["Product Name"] || "").trim(),
            product_type: (item["Type"] || "").trim(),
            production_year: parseInt(productionYear) || 0,
            profit_margin: profitMargin,
            profit_made: profitMade,
            release_price: releasePrice,
            product_url: item["Link to Product Pictures"] || "",
            category: item["Category"] || "",
            similarity: item["similarity"] || 0,
            cluster: item["cluster"] || 0,
            market_price: parseFloat(releasePrice?.replace(/[^0-9.]/g, "") || "0"),
            profit_made_value: parseFloat(profitMade?.replace(/[^0-9.]/g, "") || "0"),
          };
        });
      };

      const formattedData = formatItems(searchData);
      setData({
        matched: formattedData,
        compared: [],
      });

    } catch (err) {
      console.error("Search failed:", err);
      setError(`Failed to load product data: ${err.message}. Please try again.`);
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
      handleSearch(selectedQuery);
    } else if (typeof value === 'string') {
      setSearchQuery(value);
      handleSearch(value);
    }
  };

  const firstProduct = data.matched?.[0] || {};
 const profitMarginValue = parseFloat(
  String(firstProduct.profit_margin || "0").replace("%", "")
);

  const marketPriceValue = firstProduct.market_price || 0;
  const profitValueMade = firstProduct.profit_made_value || 0;

const chartData = {
  labels: [`Market Price: $${marketPriceValue}`], 
  datasets: [
    {
      label: "Profit Margin",
      data: [profitMarginValue], 
      backgroundColor: "#4FC3F7", 
      categoryPercentage: 0.6,
      barThickness: 80,
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
          return `Profit Margin: ${context.raw}%`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Product",
        font: { weight: "bold" },
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 25, 
        callback: function (value) {
          return `${value}%`;
        },
      },
      title: {
        display: true,
        text: "Profit Margin (%)",
        font: { weight: "bold" },
      },
      grid: {
        color: "#e0e0e0",
      },
    },
  },
};
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
        Loading product data
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
        This may take a moment 
      </Typography>
    </Box>
  );

  // Show initial loading screen while fetching all products data
  if (initialDataLoading) {
    return <InitialLoadingComponent />;
  }

  return (
    <>
      <div className="meow">
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
              if (!newInputValue) { 
                setSearchQuery("");
                setData({ matched: [], compared: [] });
                return;
              }
              setSearchQuery(newInputValue);
            }}
            onChange={handleSuggestionSelect}
            onKeyDown={handleKeyPress}
            noOptionsText={
              searchQuery.length < 1 
                ? "Start typing to search for brands, products, or types..." 
                : "No matching products found"
            }
            disabled={loading}
            filterOptions={(options) => options} 
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
                      <span style={{ color: '#1976d2' }}>{option.brand}</span> {option.productName} 
                      <span style={{ color: '#666', fontWeight: 'normal' }}> - {option.type}</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.profitMargin} margin • {option.productionYear}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={searchLabel}
                variant="outlined"
                className="input-form"
                placeholder="Type to filter..."
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
      </div>

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
            No Match found for "<strong>{searchQuery}</strong>"
          </Typography>
        </Box>
      )}

      {!loading && data.matched.length > 0 && (
        <>
          <Typography variant="h4" align="center" fontWeight="bold" my={4}>
            {firstProduct.brand} {firstProduct.product_name}{" "}
            {firstProduct.product_type} ({firstProduct.production_year})
          </Typography>

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

            {/* Chart Section */}
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
            Search Results ({data.matched.length} products found)
          </Typography>

         <Paper elevation={3}>
  <Table>
    <TableHead sx={{ backgroundColor: "#bbdefb" }}>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Profit Margin</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.matched.map((row, index) => {
        const isFirstResult = index === 0; 

        return (
          <TableRow
            key={row.id}
            sx={{
              backgroundColor: isFirstResult
                ? "#e3f2fd" 
                : "inherit",
              borderLeft: isFirstResult ? "4px solid #1976d2" : "none",
              "&:hover": {
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            <TableCell sx={{ fontWeight: isFirstResult ? "bold" : "500" }}>
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
            <TableCell sx={{ fontWeight: isFirstResult ? "bold" : "normal" }}>
              {row.product_name}
            </TableCell>
            <TableCell>
              <Box sx={{ fontWeight: "bold", color: "#1976d2" }}>
                {row.profit_margin}
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