import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import Fuse from "fuse.js";
import stringSimilarity from "string-similarity";

const cellStyle = {
  padding: "20px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "1.2rem",
  wordBreak: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

export const TabThree = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allTaxData, setAllTaxData] = useState([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setopen] = useState(false);

  const isDesktop = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const fetchAllTaxData = async () => {
      setInitialDataLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-tax-data`,
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
        const apiData = result.data || [];
        const formattedData = apiData.map((item, index) => ({
          id: index,
          label: `${item["Company Name"] || ""} (${item.Year || ""})`.trim(),
          value: item["Company Name"] || "",
          companyName: item["Company Name"] || "",
          year: item.Year || "",
          taxesPaid: item["Taxes Paid"] || item["Tax Paid"] || "N/A",
          taxesAvoided: item["Taxes Avoided"] || item["Tax Avoided"] || "N/A",
          searchText: [
            (item["Company Name"] || "").toLowerCase(),
            (item.Year || "").toString().toLowerCase(),
            `${item["Company Name"] || ""} ${item.Year || ""}`.toLowerCase(),
          ].filter((text) => text.trim() !== ""),
        }));

        setAllTaxData(formattedData);
      } catch (err) {
        console.error("Failed to fetch initial tax data:", err);
        setError("Failed to load tax data. Please refresh the page.");
      } finally {
        setInitialDataLoading(false);
      }
    };

    fetchAllTaxData();
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery?.trim() || allTaxData.length === 0) return [];

    const query = searchQuery.toLowerCase().trim();
    const queryParts = query.match(/[a-z]+|\d+/gi) || [];

    const fuse = new Fuse(allTaxData, {
      keys: [
        { name: "companyName", weight: 0.6 },
        { name: "year", weight: 0.3 },
        { name: "taxesPaid", weight: 0.05 },
        { name: "taxesAvoided", weight: 0.05 },
      ],
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
    });

    // 🔹 1. Fuzzy search
    let fuzzyResults = fuse.search(query).map((r) => ({
      ...r.item,
      score: r.score,
    }));

    // 🔹 2. Boosts for exact/partial matches
    fuzzyResults = fuzzyResults.map((item) => {
      const company = item.companyName.toLowerCase();
      const year = item.year.toString();
      let boost = 0;

      if (company === query) boost += 0.5;
      if (company.startsWith(query)) boost += 0.3;
      if (year === query) boost += 0.2;
      if (queryParts.length > 1 && queryParts.every((p) => company.includes(p)))
        boost += 0.25;

      return { ...item, score: (item.score || 1) - boost };
    });

    // 🔹 3. Semantic fallback
    const semanticMatches = allTaxData
      .map((item) => {
        const text = `${item.companyName} ${item.year}`.toLowerCase();
        const sim = stringSimilarity.compareTwoStrings(text, query);
        return { ...item, score: 1 - sim * 0.5 };
      })
      .filter((i) => i.score < 0.7);

    // 🔹 4. Combine & deduplicate
    const combined = [
      ...fuzzyResults,
      ...semanticMatches.filter(
        (s) =>
          !fuzzyResults.some(
            (f) => f.companyName === s.companyName && f.year === s.year
          )
      ),
    ];

    // 🔹 5. Initial ranking by relevance
    let ranked = combined.sort((a, b) => a.score - b.score).slice(0, 50);

    // 🔹 6. Extract query year if exists
    const queryYearMatch = query.match(/\d{4}/);
    const queryYear = queryYearMatch ? parseInt(queryYearMatch[0], 10) : null;

    // 🔹 7. Separate exact year matches (if queryYear exists)
    let yearMatches = [];
    let otherMatches = [];

    ranked.forEach((item) => {
      if (queryYear && item.year === queryYear) {
        yearMatches.push(item);
      } else {
        otherMatches.push(item);
      }
    });

    // 🔹 8. Group remaining matches by company and sort each group by year descending
    const grouped = otherMatches.reduce((acc, item) => {
      const key = item.companyName.toLowerCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    Object.values(grouped).forEach((group) => {
      group.sort((a, b) => b.year - a.year);
    });

    const groupedSorted = Object.keys(grouped)
      .map((key) => grouped[key])
      .flat();

    // 🔹 9. Combine exact year matches first, then grouped & sorted results
    ranked = [...yearMatches, ...groupedSorted].slice(0, 20);

    return ranked;
  }, [searchQuery, allTaxData]);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredData([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/tax-semantic-search`,
        {
          query: query,
          tab_type: "tax",
        }
      );

      const rawRows = res.data?.data || [];

      const rows = rawRows.map((row, index) => ({
        id: `${(row["Company Name"] || "").trim()}-${(row["Year"] || "")
          .toString()
          .trim()}-${index}`,
        company_name: (row["Company Name"] || "").trim(),
        year: (row["Year"] || "").toString().trim(),
        tax_paid: (row["Taxes Paid"] || "").trim(),
        tax_avoid: (row["Taxes Avoided"] || "").trim(),
      }));

      // ✅ Split query into words + numbers (so Apple2024 → ["apple", "2024"])
      const searchTerms =
        query
          .toLowerCase()
          .trim()
          .match(/[a-z]+|\d+/g) || [];

      const filtered = rows.filter((row) => {
        const companyName = (row.company_name || "").toLowerCase();
        const year = (row.year || "").toString().toLowerCase();

        return searchTerms.some(
          (term) => companyName.includes(term) || year.includes(term)
        );
      });

      const sorted = [...filtered]
        .filter((row) => row.year)
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

      const topFourYears = sorted.slice(0, 4);

      setFilteredData(topFourYears);
      setError("");
    } catch (err) {
      setFilteredData([]);
      console.error("Tax search failed:", err);
      setError(`Tax data Not Matched with: ${query}.`);

      // setError(`Failed to load data: ${err.message}. Please try again.`);
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
      const payload = {
        companyName: value.companyName,
        year: value.year,
        taxesPaid: value.taxesPaid,
        taxesAvoided: value.taxesAvoided,
      };
      setSelectedItem(payload);
      setSearchQuery(value.label);
      const searchTerm = `${value.companyName} (${value.year})`;
      handleSearch(searchTerm);
    } else if (typeof value === "string") {
      if (suggestions.length >= 1) {
        handleSearch(suggestions[0].label);
        setSearchQuery(suggestions[0].label);
      } else {
        const cleanValue = value.replace(/\\/g, "").trim();
        setSearchQuery(cleanValue);
        handleSearch(cleanValue);
      }
    }
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
        Searching tax data...
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
        Analyzing company tax information
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
        Loading tax data
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
        This may take a moment
      </Typography>
    </Box>
  );

  if (initialDataLoading) {
    return <InitialLoadingComponent />;
  }

  return (
    <>
      <div className="meow">
        <Box m={3} className="nomargin">
          <Autocomplete
            freeSolo
            value={selectedOption}
            options={suggestions}
            className="autoinput"
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.label || "";
            }}
            inputValue={searchQuery}
            onBlur={(event) => {
              if (searchQuery.trim()) {
                if (suggestions.length >= 1) {
                  handleSearch(suggestions[0].label);
                  setSearchQuery(suggestions[0].label);
                } else handleSearch(searchQuery.trim());
              }
            }}
            onInputChange={(event, newInputValue) => {
              if (!newInputValue) {
                setSearchQuery("");
                setSelectedOption(null);
                setFilteredData([]);
                return;
              }
              setSelectedOption(null);
              setSearchQuery(newInputValue);
            }}
            onChange={handleSuggestionSelect}
            // onKeyDown={handleKeyPress}
            noOptionsText={
              searchQuery.length < 1
                ? "Start typing to search for companies or years..."
                : "No matching tax data found"
            }
            disabled={loading}
            filterOptions={(options) => options}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      <span style={{ color: "#1976d2" }}>
                        {option.companyName}
                      </span>
                      <span style={{ color: "#999", fontWeight: "normal" }}>
                        {" "}
                        ({option.year})
                      </span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Paid: {option.taxesPaid} • Avoided: {option.taxesAvoided}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by company name or year"
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
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && searchQuery && filteredData.length === 0 && !error && (
        <Typography
          align="center"
          color="textSecondary"
          my={4}
          dangerouslySetInnerHTML={{
            __html: `No Match found for <strong>${searchQuery
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}</strong>`,
          }}
        />
      )}

      {!!filteredData.length && !error && (
        <div className="taxavoidance_card">
          {/* Body */}
          {filteredData.map((row, index) => (
            <>
              <Card
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 3,
                  mb: 2,
                }}
              >
                {/* Left Section */}
                <CardContent
                  className="nopadding"
                  sx={{
                    width: "50%",
                    marginRight: "20px",
                    flex: 1,
                    p: 0,
                  }}
                >
                  <Typography
                    variant="h4"
                    align="left"
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    {row.company_name} ({row.year})
                    {!isDesktop ? (
                      <Tooltip
                        title="an estimate"
                        placement="top"
                        open={open}
                        sx={{ cursor: "pointer" }}
                      >
                        <span onClick={() => setopen(!open)}>*</span>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="an estimate"
                        placement="top"
                        sx={{ cursor: "pointer" }}
                      >
                        *
                      </Tooltip>
                    )}
                  </Typography>
                  <Box
                    key={`${row.company_name}-${row.year}-${index}`}
                    className="tablebody"
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#E9E7CA",
                        color: "#0C7E57",
                        width: "50%",
                        // borderRight: "1px solid gray",
                      }}
                    >
                      <Typography variant="h6">
                        <span className="border-b-2 border-[#0C7E57] TaxTitle">
                          Tax Paid
                        </span>
                        <span className="TaxValue">{row.tax_paid}</span>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "#FEC7C7",
                        color: "#EC4137",
                        width: "50%",
                      }}
                    >
                      <Typography variant="h6">
                        <span className="border-b-2 border-[#EC4137] TaxTitle">
                          Tax Avoided
                        </span>
                        <span className="TaxValue">{row.tax_avoid}</span>
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" mt="10px" align="left">
                    {row.company_name} paid {row.tax_paid} but avoided an
                    estimate of {row.tax_avoid} in taxes in {row.year} by
                    exploiting tax loopholes.
                  </Typography>
                </CardContent>
              </Card>
            </>
          ))}
        </div>
      )}
    </>
  );
};
