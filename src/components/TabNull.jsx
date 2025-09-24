import { useState, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Grid,
  Card,
} from "@mui/material";
//import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export const TabNull = ({
  searchLabel = "Search by brands, products or types",
  onResults,
}) => {
  const [data, setData] = useState({ matched: [], compared: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allProductsData, setAllProductsData] = useState([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const [showComparison, setshowComparison] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");
  const [globalData, setglobalData] = useState({});

  const isDesktop = useMediaQuery("(min-width:768px)");

  const handleCompare = () => {
    setshowComparison((prev) => !prev);
  };

  useEffect(() => {
    // Notify Tabs whenever results change
    onResults(!!data.matched.length);
  }, [data.matched, onResults]);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPod|iPad/i.test(ua)) {
      setDeviceType("mobile");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  useEffect(() => {
    const fetchAllProductsData = async () => {
      setInitialDataLoading(true);
      try {
        const response = await fetch(
          "https://api.the-aysa.com/get-profit-margin-data",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Initial data fetch result:", result);
        const apiData = result.data || [];

        const formattedData = apiData.map((item, index) => ({
          id: index,
          label: `${item.Brand || ""} ${item["Product Name"] || ""} ${
            item.Type || ""
          }`.trim(),
          value: `${item.Brand || ""} ${item["Product Name"] || ""} ${
            item.Type || ""
          }`.trim(),
          brand: item.Brand || "",
          productName: item["Product Name"] || "",
          type: item.Type || "",
          category: item.Category || "",
          profitMargin:
            item["Profit Margin"] || item["Profit Margin "] || "N/A",
          productionYear:
            item["Production Year"] || item["Production Year "] || "N/A",
          image: item["Link to Product Pictures"] || "",
          searchText: [
            (item.Brand || "")?.toLowerCase(),
            (item["Product Name"] || "")?.toLowerCase(),
            (item.Type || "")?.toLowerCase(),
            (item.Category || "")?.toLowerCase(),
            `${item.Brand || ""} ${item["Product Name"] || ""}`?.toLowerCase(),
            `${item.Brand || ""} ${item.Type || ""}`?.toLowerCase(),
            `${item.Brand || ""} ${item.Category || ""}`?.toLowerCase(),
            `${item["Product Name"] || ""} ${item.Type || ""}`?.toLowerCase(),
            `${item["Product Name"] || ""} ${
              item.Category || ""
            }`?.toLowerCase(),
            `${item.Type || ""} ${item.Category || ""}`?.toLowerCase(),
            `${item.Brand || ""} ${item["Product Name"] || ""} ${
              item.Type || ""
            }`?.toLowerCase(),
            `${item.Brand || ""} ${item["Product Name"] || ""} ${
              item.Category || ""
            }`?.toLowerCase(),
            `${item.Brand || ""} ${item.Type || ""} ${
              item.Category || ""
            }`?.toLowerCase(),
            `${item["Product Name"] || ""} ${item.Type || ""} ${
              item.Category || ""
            }`?.toLowerCase(),
            `${item.Brand || ""} ${item["Product Name"] || ""} ${
              item.Type || ""
            } ${item.Category || ""}`?.toLowerCase(),
          ].filter((text) => text.trim() !== ""),
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

  // Modified suggestions to only show after 3 characters
  const suggestions = useMemo(() => {
    if (
      !searchQuery ||
      searchQuery.length < 3 ||
      allProductsData.length === 0
    ) {
      return [];
    }

    const query = searchQuery?.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter((word) => word.length > 0);

    const filteredSuggestions = allProductsData.filter((item) => {
      const brand = item.brand?.toLowerCase() || "";
      const productName = item.productName?.toLowerCase() || "";
      const productType = item.type?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";

      // Create search terms for exact matching
      const searchTerms = [
        brand,
        productName,
        productType,
        category,
        `${brand} ${productName}`.trim(),
        `${brand} ${productType}`.trim(),
        `${brand} ${category}`.trim(),
        `${productName} ${productType}`.trim(),
        `${productName} ${category}`.trim(),
        `${productType} ${category}`.trim(),
        `${brand} ${productName} ${productType}`.trim(),
        `${brand} ${productName} ${category}`.trim(),
        `${brand} ${productType} ${category}`.trim(),
        `${productName} ${productType} ${category}`.trim(),
        `${brand} ${productName} ${productType} ${category}`.trim(),
      ].filter((term) => term.length > 0);

      // Check if the full query matches any search term (starts with or includes)
      const matchesFullQuery = searchTerms.some(
        (term) =>
          term.startsWith(query) ||
          term.includes(` ${query}`) ||
          term.includes(`${query} `)
      );

      // For multi-word queries, ensure all words are present in the item
      const matchesAllWords =
        queryWords.length > 1
          ? queryWords.every((word) =>
              searchTerms.some(
                (term) =>
                  term.startsWith(word) ||
                  term.includes(` ${word}`) ||
                  term.includes(`${word} `) ||
                  term === word
              )
            )
          : true;

      // Individual field matching with word boundaries
      const matchesIndividualFields =
        brand.startsWith(query) ||
        productName.startsWith(query) ||
        productType.startsWith(query) ||
        category.startsWith(query) ||
        brand.includes(` ${query}`) ||
        productName.includes(` ${query}`) ||
        productType.includes(` ${query}`) ||
        category.includes(` ${query}`) ||
        // For queries 3+ characters, allow substring matching
        (query.length >= 3 &&
          (brand.includes(query) ||
            productName.includes(query) ||
            productType.includes(query) ||
            category.includes(query)));

      // Combine all matching strategies
      return (matchesFullQuery && matchesAllWords) || matchesIndividualFields;
    });

    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
      const aBrand = a.brand.toLowerCase();
      const bBrand = b.brand.toLowerCase();
      const aProduct = a.productName.toLowerCase();
      const bProduct = b.productName.toLowerCase();
      const aType = a.type.toLowerCase();
      const bType = b.type.toLowerCase();
      const aCategory = a.category.toLowerCase();
      const bCategory = b.category.toLowerCase();

      const aExactBrand = aBrand === query;
      const bExactBrand = bBrand === query;
      if (aExactBrand !== bExactBrand) return bExactBrand - aExactBrand;

      const aBrandStarts = aBrand.startsWith(query);
      const bBrandStarts = bBrand.startsWith(query);
      if (aBrandStarts !== bBrandStarts) return bBrandStarts - aBrandStarts;

      const aProductStarts = aProduct.startsWith(query);
      const bProductStarts = bProduct.startsWith(query);
      if (aProductStarts !== bProductStarts)
        return bProductStarts - aProductStarts;

      const aCategoryStarts = aCategory.startsWith(query);
      const bCategoryStarts = bCategory.startsWith(query);
      if (aCategoryStarts !== bCategoryStarts)
        return bCategoryStarts - aCategoryStarts;

      if (queryWords.length > 1) {
        const aMatchScore = queryWords.reduce((score, word, index) => {
          if (
            aBrand.startsWith(word) ||
            aProduct.startsWith(word) ||
            aCategory.startsWith(word)
          ) {
            return score + (queryWords.length - index);
          }
          if (
            aBrand.includes(word) ||
            aProduct.includes(word) ||
            aCategory.includes(word)
          ) {
            return score + 1;
          }
          return score;
        }, 0);

        const bMatchScore = queryWords.reduce((score, word, index) => {
          if (
            bBrand.startsWith(word) ||
            bProduct.startsWith(word) ||
            bCategory.startsWith(word)
          ) {
            return score + (queryWords.length - index);
          }
          if (
            bBrand.includes(word) ||
            bProduct.includes(word) ||
            bCategory.includes(word)
          ) {
            return score + 1;
          }
          return score;
        }, 0);

        if (aMatchScore !== bMatchScore) return bMatchScore - aMatchScore;
      }

      const aTypeStarts = aType.startsWith(query);
      const bTypeStarts = bType.startsWith(query);
      if (aTypeStarts !== bTypeStarts) return bTypeStarts - aTypeStarts;

      return aBrand.localeCompare(bBrand);
    });

    return sortedSuggestions.slice(0, 15);
  }, [searchQuery, allProductsData]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setData({ matched: [], compared: [] });
      setSearchQuery("");
      setStatus(0);
      return;
    }

    setSearchQuery(query);
    setStatus(0);
    setLoading(true);
    setError("");

    try {
      console.log("Making search request for:", query);

      const response = await fetch(" https://api.the-aysa.com/global-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, device_type: deviceType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.status);
      setglobalData(result);
      console.log(result);

      setStatus(result.status);
      const searchData = result.data || [];

      const formatItems = (items) => {
        if (!Array.isArray(items)) {
          console.warn("formatItems received non-array:", items);
          return [];
        }

        return items.map((item, index) => {
          const profitMargin = String(
            item["Profit Margin"] || item["Profit Margin "] || "0%"
          );
          const profitMade =
            item["Profit Made"] || item["Profit Made "] || "$0";
          const releasePrice =
            item["Release Price"] || item["Release Price "] || "$0";
          const productionYear =
            item["Production Year"] || item["Production Year "] || 0;

          return {
            id: `${item["Brand"]}-${item["Product Name"]}-${index}`,
            brand: (item["Brand"] || "").trim(),
            product_name: (item["Product Name"] || "").trim(),
            product_type: (item["Product Type"] || "").trim(), // Use 'Product Type' for search API
            production_year: parseInt(productionYear) || 0,
            profit_margin: profitMargin,
            profit_made: profitMade,
            release_price: releasePrice,
            product_url: item["Link to Product Pictures"] || "",
            category: item["Category"] || "",
            similarity: item["similarity"] || 0,
            cluster: item["cluster"] || 0,
            market_price: parseFloat(
              releasePrice?.replace(/[^0-9.]/g, "") || "0"
            ),
            profit_made_value: parseFloat(
              profitMade?.replace(/[^0-9.]/g, "") || "0"
            ),
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
      setError(`Product Not Matched with: ${searchQuery}.`);
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
    if (value && typeof value === "object") {
      const selectedQuery = value.value;
      setSearchQuery(selectedQuery);
      setStatus(0);

      handleSearch(selectedQuery);
    } else if (typeof value === "string") {
      setSearchQuery(value);
      setStatus(0);

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

  console.log("ceo_worker_data:", globalData?.ceo_worker_data);

  return (
    <>
      <div className="meow">
        <Box m={3} className="nomargin">
          <Autocomplete
            freeSolo
            className="autoinput"
            options={suggestions}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.label || "";
            }}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) => {
              if (!newInputValue) {
                setSearchQuery("");
                setStatus(0);

                setData({ matched: [], compared: [] });
                setshowComparison(false);
                return;
              }
              setSearchQuery(newInputValue);
              setStatus(0);
            }}
            onChange={handleSuggestionSelect}
            onKeyDown={handleKeyPress}
            noOptionsText={
              searchQuery.length < 3
                ? "Type at least 3 characters to search for brands, products, or types..."
                : suggestions.length > 0
                ? "" // Don't show "no options" text when suggestions are available
                : "No matching products found"
            }
            disabled={loading}
            filterOptions={(options) => options}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  {option.image && (
                    <Box sx={{ mr: 2 }}>
                      <img
                        src={option.image}
                        alt={option.label}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      <span style={{ color: "#1976d2" }}>{option.brand}</span>{" "}
                      {option.productName}
                      <span style={{ color: "#666", fontWeight: "normal" }}>
                        {" "}
                        - {option.type}
                      </span>
                      {option.category && (
                        <span style={{ color: "#999", fontWeight: "normal" }}>
                          {" "}
                          • {option.category}
                        </span>
                      )}
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
                placeholder="Type at least 3 characters to filter..."
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

      {!loading && searchQuery && !error && (
        <>
          {/* Case 1: API status 404 */}
          {status === 404 && (
            <Box textAlign="center" my={6}>
              <Typography variant="h6" color="text.secondary">
                Product Not Matched with "<strong>{searchQuery}</strong>"
              </Typography>
            </Box>
          )}

          {/* Case 2: No API hit yet (status === 0), but suggestions exist */}
          {status === 0 && suggestions.length > 0 && !data.matched.length && (
            <Box textAlign="center" my={6}>
              <Typography variant="h6" color="text.secondary">
                Product Not Matched with "<strong>{searchQuery}</strong>"
              </Typography>
            </Box>
          )}

          {/* Case 3: No API hit, no suggestions */}
          {status === 0 && suggestions.length === 0 && !data.matched.length && (
            <Box textAlign="center" my={6}>
              <Typography variant="h6" color="text.secondary">
                Product Not Matched with "<strong>{searchQuery}</strong>"
              </Typography>
            </Box>
          )}
        </>
      )}

      {!loading &&
        data.matched.length > 0 &&
        (isDesktop ? (
          <>
            <div className="serachedProduct">
              <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                my={4}
                sx={{ textTransform: "capitalize" }}
              >
                {`${firstProduct.brand} ${firstProduct.product_name} (${firstProduct.production_year})`.replace(
                  /\b(\w+)\s+\1\b/gi,
                  "$1"
                )}
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start", // optional if you want top alignment
                }}
              >
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Box display="flex" flexWrap="wrap" justifyContent="center">
                    <Box>
                      {firstProduct.product_url ? (
                        <Box textAlign="center">
                          <img
                            src={firstProduct.product_url}
                            alt={`${firstProduct.brand} ${firstProduct.product_name}`}
                            style={{
                              width: "100%",
                              maxWidth: "200px",
                              height: "auto",
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            // onError={(e) => {
                            //   e.target.style.display = "block";
                            // }}

                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMjAgMjBINDBWNDBIMjBWMjBaIiBmaWxsPSIjRERERERFIi8+PC9zdmc+";
                              e.currentTarget.style.width = "200px"; // 👈 enforce width even on fallback
                              e.currentTarget.style.height = "200px";
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
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    minWidth: "260px",
                  }}
                >
                  <div className="w-full">
                    {/* Label Row */}
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        Profit Margin
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData?.data[0]["Profit Margin"] || "N/A"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${globalData?.data[0]["Profit Margin"] || 0}`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    {/* Label Row */}
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        CEO-Worker Pay Gap
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData.ceo_worker_data.length > 0
                          ? `${globalData.ceo_worker_data[0]["Pay Ration"]
                              // .toString()
                              .toLowerCase()
                              .replace("x", " x")} `
                          : "$0"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      {globalData?.ceo_worker_data?.length > 0 && (
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              parseFloat(
                                globalData.ceo_worker_data[0]["Pay Ration"]
                                  //.toString()
                                  .toLowerCase()
                                  .replace("x", "")
                              ) || 0,
                              100 // cap at 100%
                            )}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <div className="flex justify-between mb-1">
                      <h5 className="text-lg font-medium text-gray-700">
                        Corporate Tax Avoidance
                      </h5>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        Tax Paid:
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData?.tax_data?.["Taxes Paid"] || "$0"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        Tax Avoided:
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData?.tax_data?.["Taxes Avoided"] || "$0"}
                      </span>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div className="w-full mt-4">
                <p className="textleft">
                  {firstProduct.brand} makes{" "}
                  {globalData?.data[0]["Profit Made"] || "N/A"} on a{" "}
                  {globalData?.data[0]["Release Price"]}{" "}
                  {firstProduct.product_name}, and its CEO earns{" "}
                  {globalData?.ceo_worker_data.length > 0
                    ? `${globalData.ceo_worker_data[0]["Pay Ration"]
                        //.toString()
                        .toLowerCase()
                        .replace("x", " ")}`
                    : "0"}{" "}
                  times more than the average worker.
                </p>
              </div>
              {/* data.matched.length > 1 && (
                <div className="w-full mt-4">
                  <Button variant="contained" onClick={handleCompare}>
                    <MdOutlineCompareArrows className="compareIcon" /> Click
                    Here to Compare Profit Margins
                  </Button>
                </div>
              )*/}
            </div>

            {/* Only show the table and comparison heading when there are 2 or more products */}

            {globalData.data.length > 1 && (
              <>
                <div className="comparisonTable">
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="h4"
                      align="center"
                      sx={{ fontWeight: "bold", mb: 3 }}
                    >
                      Comparing Profit Margins
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 3,
                      }}
                    >
                      {globalData.data.map((row, i) => (
                        <Card
                          key={row.id}
                          elevation={3}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            borderRadius: 3,
                          }}
                        >
                          {/* Product Image */}
                          <Box sx={{ mb: 2 }}>
                            {row["Link to Product Pictures"] ? (
                              <img
                                src={row["Link to Product Pictures"]}
                                alt={`${row.brand} ${row.product_name}`}
                                style={{
                                  width: "100%",
                                  maxHeight: 150,
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                }}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMjAgMjBINDBWNDBIMjBWMjBaIiBmaWxsPSIjRERERERFIi8+PC9zdmc+";
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 150,
                                  backgroundColor: "#f0f0f0",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                >
                                  No Image
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            {row.Brand} {row["Product Name"]}{" "}
                          </Typography>

                          <Box sx={{ width: "100%", mb: 1 }}>
                            <Box
                              sx={{
                                width: "100%",
                                height: 12,
                                backgroundColor: "#e0e0e0",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "100%",
                                  backgroundColor: "#2196f3",
                                  borderRadius: 2,
                                  transition: "width 0.5s ease",
                                  width: `${(row["Profit Margin"] || "0%")
                                    .toString()
                                    .replace(/\s+/g, "")}`,
                                }}
                              />
                            </Box>
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold" }}
                            align="left"
                          >
                            {(row["Profit Margin"] || "0%")
                              .toString()
                              .replace(/\s+/g, "")}
                          </Typography>

                          {/* {!loading && i === 0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="left"
                              sx={{ mt: 1 }}
                            >
                              {row.Brand} makes {row["Profit Made"]} on a{" "}
                              {row["Release Price"]} {firstProduct.product_name}{" "}
                              {row.product_type} , and its CEO earns{" "}
                              {globalData?.ceo_worker_data.length > 0
                                ? `${globalData.ceo_worker_data[0]["Pay Ration"]
                                    //.toString()
                                    .toLowerCase()
                                    .replace("x", "")}`
                                : "0"}{" "}
                              times more than the average worker.
                            </Typography>
                          )} */}
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* Only show the table and comparison heading on mobile view */}

            <div className="serachedProduct">
              <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                my={4}
                sx={{ textTransform: "capitalize" }}
              >
                {`${firstProduct.brand} ${firstProduct.product_name} (${firstProduct.production_year})`.replace(
                  /\b(\w+)\s+\1\b/gi,
                  "$1"
                )}
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start", // optional if you want top alignment
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    minWidth: "100%",
                  }}
                >
                  <div className="w-full">
                    {/* Label Row */}
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        Profit Margin
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData?.data[0]["Profit Margin"] || "N/A"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${globalData?.data[0]["Profit Margin"] || 0}`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    {/* Label Row */}
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        CEO-Worker Pay Gap
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData.ceo_worker_data.length > 0
                          ? `${globalData.ceo_worker_data[0]["Pay Ratio"]
                              //.toString()
                              .toLowerCase()
                              .replace("x", " x")} `
                          : "$0"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      {globalData?.ceo_worker_data?.length > 0 && (
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              parseFloat(
                                globalData.ceo_worker_data[0]["Pay Ratio"]
                                  //.toString()
                                  .toLowerCase()
                                  .replace("x", "")
                              ) || 0,
                              100 // cap at 100%
                            )}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <div className="flex justify-between mb-1">
                      <h5 className="text-lg font-medium text-gray-700">
                        Corporate Tax Avoidance
                      </h5>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        Tax Paid:
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData?.tax_data?.["Taxes Paid"] || "$0"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-medium text-gray-700">
                        Tax Avoided:
                      </span>
                      <span className="text-md font-medium text-gray-700">
                        {globalData?.tax_data?.["Taxes Avoided"] || "$0"}
                      </span>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div className="w-full mt-4">
                <p class="text-left">
                  {firstProduct.brand} makes{" "}
                  {globalData?.data[0]["Profit Made"] || "N/A"} on a{" "}
                  {globalData?.data[0]["Release Price"]}{" "}
                  {firstProduct.product_name}{" "}
                  {globalData?.data[0]["Product Type"]}, and its CEO earns{" "}
                  {globalData?.ceo_worker_data.length > 0
                    ? `${globalData.ceo_worker_data[0]["Pay Ratio"]
                        //.toString()
                        .toLowerCase()
                        .replace("x", " ")}`
                    : "$0"}{" "}
                  more than the average worker.
                </p>
              </div>
              {data.matched.length > 1 && (
                <div className="w-full mt-4">
                  <Button variant="contained" onClick={handleCompare}>
                    Click Here to Compare Profit Margins
                  </Button>
                </div>
              )}
            </div>

            {/* Only show the table and comparison heading when there are 2 or more products in mobile view */}

            {globalData.data.length > 1 && showComparison && (
              <>
                <div className="comparisonTable">
                  <Box sx={{ mt: 3 }}>
                    {/* <Typography
                      variant="h4"
                      align="center"
                      sx={{ fontWeight: "bold", mb: 3 }}
                    >
                      Comparing Profit Margins
                    </Typography> */}
                    <Typography
                      variant="h4"
                      align="center"
                      fontWeight="bold"
                      my={4}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {`${firstProduct.brand} ${firstProduct.product_name} (${firstProduct.production_year})`.replace(
                        /\b(\w+)\s+\1\b/gi,
                        "$1"
                      )}
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="space-between"
                        sx={{
                          width: "100%;",
                        }}
                      >
                        <Card
                          elevation={3}
                          sx={{
                            p: 1,
                            textAlign: "center",
                            borderRadius: 3,
                            width: "35%;",
                          }}
                        >
                          <Box
                            display="flex"
                            flexWrap="wrap"
                            justifyContent="center"
                          >
                            <Box>
                              {firstProduct.product_url ? (
                                <Box textAlign="center">
                                  <img
                                    src={firstProduct.product_url}
                                    alt={`${firstProduct.brand} ${firstProduct.product_name}`}
                                    style={{
                                      width: "100%",
                                      maxWidth: "120px",
                                      height: "auto",
                                      borderRadius: "12px",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                    // onError={(e) => {
                                    //   e.target.style.display = "block";
                                    // }}

                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMjAgMjBINDBWNDBIMjBWMjBaIiBmaWxsPSIjRERERERFIi8+PC9zdmc+";
                                      e.currentTarget.style.width = "200px"; // 👈 enforce width even on fallback
                                      e.currentTarget.style.height = "200px";
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    align="left"
                                    fontWeight="bold"
                                    my={1}
                                    sx={{
                                      textTransform: "capitalize",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {`${firstProduct.brand} ${firstProduct.product_name} (${firstProduct.production_year})`.replace(
                                      /\b(\w+)\s+\1\b/gi,
                                      "$1"
                                    )}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "100px",
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    align="left"
                                    fontWeight="bold"
                                    my={1}
                                    sx={{
                                      textTransform: "capitalize",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {`${firstProduct.brand} ${firstProduct.product_name} ${firstProduct.product_type} (${firstProduct.production_year})`.replace(
                                      /\b(\w+)\s+\1\b/gi,
                                      "$1"
                                    )}
                                  </Typography>
                                  <Typography color="text.disabled">
                                    No image available
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Card>
                        <Box
                          sx={{
                            display: "flex",
                            width: "65%",
                            justifyContent: "center",
                            flexDirection: "column",
                            paddingLeft: "5px",
                          }}
                        >
                          {globalData.data.map((row, i) => {
                            // Clean value
                            const rawValue = (row["Profit Margin"] || "0%")
                              .replace(/\s/g, "")
                              .replace("%", "");
                            const numericValue = parseFloat(rawValue) || 0;

                            // Cap at 100%
                            const cappedValue = Math.min(numericValue, 100);

                            // Final width
                            const profitMargin = `${cappedValue}%`;

                            return (
                              <div
                                key={i}
                                className="mobileCompareGlobalSerach"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  paddingBottom: "10px",
                                }}
                              >
                                {/* Brand Label */}
                                {/* <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "13px",
                                    width: "80px",
                                    wordWrap: "break-word",
                                    marginRight: "5px",
                                    textAlign: "right",
                                  }}
                                >
                                  {row.Brand}{" "}
                                  {row["Product Name"]
                                    ? row["Product Name"]
                                        .split(" ")
                                        .slice(0, 3)
                                        .join(" ")
                                    : ""}
                                </Typography> */}

                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "13px",
                                    width: "120px",
                                    wordWrap: "break-word",
                                    marginRight: "5px",
                                    textAlign: "right",
                                    lineHeight: "18px;",
                                  }}
                                >
                                  {(() => {
                                    const brand = row.Brand?.trim() || "";
                                    const productName =
                                      row["Product Name"]?.trim() || "";

                                    // Take only first 3 words of product name
                                    const productShort = productName
                                      .split(" ")
                                      .slice(0, 3)
                                      .join(" ");

                                    // Check if product name starts with brand
                                    const showName = productName
                                      .toLowerCase()
                                      .startsWith(brand.toLowerCase())
                                      ? productShort
                                      : `${brand} ${productShort}`;

                                    return showName;
                                  })()}
                                </Typography>

                                {/* Bar Container */}
                                <Box
                                  sx={{
                                    flex: 1,
                                    ml: 0,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    className="customGraphMobile"
                                    sx={{
                                      flex: 1,
                                      height: 40,
                                      borderRadius: 0,
                                      borderLeft: "1px solid #ccc",
                                      position: "relative",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        height: "100%",
                                        backgroundColor:
                                          i === 0
                                            ? "#42a5f5"
                                            : i === 1
                                            ? "#1e88e5"
                                            : "#1565c0",
                                        borderRadius: 0,
                                        transition: "width 0.5s ease",
                                        width: profitMargin, // e.g. "60%"
                                      }}
                                    />
                                    <span className="ml-1">
                                      {row["Profit Margin"]
                                        ? `${parseFloat(
                                            row["Profit Margin"]
                                          ).toFixed(2)}%`
                                        : "N/A"}
                                    </span>
                                  </Box>
                                </Box>
                              </div>
                            );
                          })}
                        </Box>
                      </Box>
                    </Grid>
                  </Box>
                  {globalData.data.map(
                    (row, i) =>
                      !loading &&
                      i === 0 && (
                        <Typography
                          key={i}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2, color: "#000", fontSize: "16px" }}
                        >
                          {(() => {
                            const mainProfit = parseFloat(row["Profit Margin"]);
                            const compareOne = parseFloat(
                              globalData?.data[1]?.["Profit Margin"] || 0
                            );
                            const compareTwo = parseFloat(
                              globalData?.data[2]?.["Profit Margin"] || 0
                            );

                            const compareOneWord =
                              mainProfit > compareOne ? "higher" : "lower";
                            const compareTwoWord =
                              mainProfit > compareTwo ? "higher" : "lower";

                            return `${row.Brand} makes ${mainProfit.toFixed(
                              2
                            )}% profit on a ${row["Release Price"]} ${
                              firstProduct.product_name
                            } — ${compareOneWord} than ${
                              globalData?.data[1]?.Brand
                            } (${compareOne.toFixed(
                              2
                            )}%) and ${compareTwoWord} than ${
                              globalData?.data[2]?.Brand
                            } (${compareTwo.toFixed(2)}%).`;
                          })()}
                        </Typography>
                      )
                  )}
                </div>
              </>
            )}
          </>
        ))}
    </>
  );
};
