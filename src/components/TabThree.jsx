import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import axios from "axios";

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

  useEffect(() => {
    const fetchAllTaxData = async () => {
      setInitialDataLoading(true);
      try {
        const response = await fetch("https://api.the-aysa.com/get-tax-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Initial tax data fetch result:", result);
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
    if (!searchQuery || searchQuery.length < 1 || allTaxData.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter((word) => word.length > 0);

    const filteredSuggestions = allTaxData.filter((item) => {
      const matchesFullQuery = item.searchText.some((text) =>
        text.includes(query)
      );
      const matchesAllWords = queryWords.every((word) =>
        item.searchText.some((text) => text.includes(word))
      );
      const companyName = item.companyName.toLowerCase();
      const year = item.year.toString().toLowerCase();

      const matchesIndividualFields =
        companyName.includes(query) ||
        year.includes(query) ||
        queryWords.some(
          (word) => companyName.includes(word) || year.includes(word)
        );

      return matchesFullQuery || matchesAllWords || matchesIndividualFields;
    });

    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
      const aExactCompany = a.companyName.toLowerCase() === query;
      const bExactCompany = b.companyName.toLowerCase() === query;
      if (aExactCompany !== bExactCompany) return bExactCompany - aExactCompany;
      const aCompanyStarts = a.companyName.toLowerCase().startsWith(query);
      const bCompanyStarts = b.companyName.toLowerCase().startsWith(query);
      if (aCompanyStarts !== bCompanyStarts)
        return bCompanyStarts - aCompanyStarts;
      const aYearMatch = a.year.toString() === query;
      const bYearMatch = b.year.toString() === query;
      if (aYearMatch !== bYearMatch) return bYearMatch - aYearMatch;
      const companyCompare = a.companyName.localeCompare(b.companyName);
      if (companyCompare !== 0) return companyCompare;

      return parseInt(b.year) - parseInt(a.year);
    });

    return sortedSuggestions.slice(0, 15);
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
      console.log("Making search request for:", query);

      const res = await axios.post(
        "https://api.the-aysa.com/tax-semantic-search",
        {
          query: query,
          tab_type: "tax",
        }
      );

      console.log("Tax search API response:", res.data);
      const rawRows = res.data?.data || [];

      console.log("Raw rows from API:", rawRows);

      const rows = rawRows.map((row, index) => ({
        id: `${(row["Company Name"] || "").trim()}-${(row["Year"] || "")
          .toString()
          .trim()}-${index}`,
        company_name: (row["Company Name"] || "").trim(),
        year: (row["Year"] || "").toString().trim(),
        tax_paid: (row["Taxes Paid"] || "").trim(),
        tax_avoid: (row["Taxes Avoided"] || "").trim(),
      }));

      console.log("Processed rows:", rows);

      // ✅ Split query into words + numbers (so Apple2024 → ["apple", "2024"])
      const searchTerms =
        query
          .toLowerCase()
          .trim()
          .match(/[a-z]+|\d+/g) || [];
      console.log("searchTerms:", searchTerms);

      const filtered = rows.filter((row) => {
        const companyName = (row.company_name || "").toLowerCase();
        const year = (row.year || "").toString().toLowerCase();

        console.log("company:", companyName);
        console.log("year:", year);

        return searchTerms.some(
          (term) => companyName.includes(term) || year.includes(term)
        );
      });

      console.log("Filtered data before sorting:", filtered);

      const sorted = [...filtered]
        .filter((row) => row.year)
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

      const topFourYears = sorted.slice(0, 4);

      console.log("Final filtered data:", topFourYears);
      setFilteredData(topFourYears);
    } catch (err) {
      console.error("Tax search failed:", err);
      setError(`Tax data Not Matched with: ${searchQuery}.`);

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
      const cleanValue = value.replace(/\\/g, "").trim();
      setSearchQuery(cleanValue);
      handleSearch(cleanValue);
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
                handleSearch(searchQuery.trim());
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
            onKeyDown={handleKeyPress}
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

      {!!filteredData.length && (
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
                        borderRight: "1px solid #000",
                      }}
                    >
                      <Typography variant="h6">
                        <span className="border-b-2 border-[#0C7E57]">
                          Tax Paid
                        </span>
                        {row.tax_paid}
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
                        <span className="border-b-2 border-[#EC4137]">
                          Tax Avoided
                        </span>
                        {row.tax_avoid}
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
