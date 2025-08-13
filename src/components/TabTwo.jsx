import { useState, useEffect, useMemo } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Autocomplete, 
  CircularProgress 
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

export const TabTwo = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCeoWorkerData, setAllCeoWorkerData] = useState([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  useEffect(() => {
    const fetchAllCeoWorkerData = async () => {
      setInitialDataLoading(true);
      try {
        const response = await fetch("https://api.the-aysa.com/get-ceo-worker-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Initial CEO-Worker data fetch result:", result);
        const apiData = result.data || [];
        const formattedData = apiData.map((item, index) => ({
          id: index,
          label: `${item["Company Name"] || ''} - ${item["CEO Name"] || ''} (${item.Year || ''})`.trim(),
          value: item["Company Name"] || '',
          companyName: item["Company Name"] || '',
          ceoName: item["CEO Name"] || '',
          year: item.Year || '',
          ceoCompensation: item["CEO Total Compensation"] || "N/A",
          workerSalary: item["Frontline Worker Salary"] || "N/A",
          searchText: [
            (item["Company Name"] || '').toLowerCase(),
            (item["CEO Name"] || '').toLowerCase(),
            (item.Year || '').toString().toLowerCase(),
            `${item["Company Name"] || ''} ${item["CEO Name"] || ''}`.toLowerCase(),
            `${item["Company Name"] || ''} ${item.Year || ''}`.toLowerCase(),
            `${item["CEO Name"] || ''} ${item.Year || ''}`.toLowerCase(),
            `${item["Company Name"] || ''} ${item["CEO Name"] || ''} ${item.Year || ''}`.toLowerCase(),
          ].filter(text => text.trim() !== '') 
        }));

        setAllCeoWorkerData(formattedData);
      } catch (err) {
        console.error("Failed to fetch initial CEO-Worker data:", err);
        setError("Failed to load CEO-Worker data. Please refresh the page.");
      } finally {
        setInitialDataLoading(false);
      }
    };

    fetchAllCeoWorkerData();
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1 || allCeoWorkerData.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(word => word.length > 0);
    
    const filteredSuggestions = allCeoWorkerData.filter(item => {
      const matchesFullQuery = item.searchText.some(text => text.includes(query));
      const matchesAllWords = queryWords.every(word => 
        item.searchText.some(text => text.includes(word))
      );
      const companyName = item.companyName.toLowerCase();
      const ceoName = item.ceoName.toLowerCase();
      const year = item.year.toString().toLowerCase();
      
      const matchesIndividualFields = 
        companyName.includes(query) || 
        ceoName.includes(query) ||
        year.includes(query) ||
        queryWords.some(word => 
          companyName.includes(word) || 
          ceoName.includes(word) ||
          year.includes(word)
        );
      
      return matchesFullQuery || matchesAllWords || matchesIndividualFields;
    });
    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
      const aExactCompany = a.companyName.toLowerCase() === query;
      const bExactCompany = b.companyName.toLowerCase() === query;
      if (aExactCompany !== bExactCompany) return bExactCompany - aExactCompany;
      const aExactCeo = a.ceoName.toLowerCase() === query;
      const bExactCeo = b.ceoName.toLowerCase() === query;
      if (aExactCeo !== bExactCeo) return bExactCeo - aExactCeo;
      const aCompanyStarts = a.companyName.toLowerCase().startsWith(query);
      const bCompanyStarts = b.companyName.toLowerCase().startsWith(query);
      if (aCompanyStarts !== bCompanyStarts) return bCompanyStarts - aCompanyStarts;
      const aCeoStarts = a.ceoName.toLowerCase().startsWith(query);
      const bCeoStarts = b.ceoName.toLowerCase().startsWith(query);
      if (aCeoStarts !== bCeoStarts) return bCeoStarts - aCeoStarts;
      const aYearMatch = a.year.toString() === query;
      const bYearMatch = b.year.toString() === query;
      if (aYearMatch !== bYearMatch) return bYearMatch - aYearMatch;
      const companyCompare = a.companyName.localeCompare(b.companyName);
      if (companyCompare !== 0) return companyCompare;
      
      return parseInt(b.year) - parseInt(a.year);
    });

    return sortedSuggestions.slice(0, 15); 
  }, [searchQuery, allCeoWorkerData]);

  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setFilteredData([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Making CEO-Worker search request for:", value); 
      const res = await axios.post(
        "https://api.the-aysa.com/ceo-worker-semantic-search",
        { query: value }
      );

      console.log("CEO-Worker search API response:", res.data); 
      const rawData = res.data?.data || [];
      const data = rawData.map((row, index) => ({
        id: `${(row["Company Name"] || '').trim()}-${(row["CEO Name"] || '').trim()}-${(row["Year"] || '').toString().trim()}-${index}`,
        company_name: (row["Company Name"] || '').trim(),
        year: (row["Year"] || '').toString().trim(),
        ceo_name: (row["CEO Name"] || '').trim(),
        ceo_total_compensation: (row["CEO Total Compensation"] || '').trim(),
        worker_salary: (row["Frontline Worker Salary"] || '').trim(),
      }));

      console.log("Processed data:", data); 

      setAllData(data);
      const filtered = data.filter(
        (row) =>
          row.company_name?.toLowerCase().includes(value.toLowerCase()) ||
          row.ceo_name?.toLowerCase().includes(value.toLowerCase())
      );

      const sorted = [...filtered]
        .filter((row) => row.year)
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

      const topFourYears = sorted.slice(0, 4);

      console.log("Final filtered data:", topFourYears); 

      setFilteredData(topFourYears);
    } catch (err) {
      console.error("CEO-Worker search failed:", err);
      setError(`Failed to load data: ${err.message}. Please try again.`);
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
        Searching CEO-Worker data...
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
        Analyzing compensation information
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
        Loading CEO-Worker data
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
                setFilteredData([]);
                return;
              }
              setSearchQuery(newInputValue);
            }}
            onChange={handleSuggestionSelect}
            onKeyDown={handleKeyPress}
            noOptionsText={
              searchQuery.length < 1 
                ? "Start typing to search for companies or CEOs..." 
                : "No matching CEO-Worker data found"
            }
            disabled={loading}
            filterOptions={(options) => options} 
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      <span style={{ color: '#1976d2' }}>{option.companyName}</span>
                      <span style={{ color: '#666', fontWeight: 'normal' }}> - {option.ceoName}</span>
                      <span style={{ color: '#999', fontWeight: 'normal' }}> ({option.year})</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      CEO: {option.ceoCompensation} • Worker: {option.workerSalary}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by company or CEO name"
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
        <Typography align="center" color="textSecondary" my={4}>
          No Match found for "<strong>{searchQuery}</strong>"
        </Typography>
      )}

      {!!filteredData.length && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: "750px" }}>
              {/* Header */}
              <Box
                className="tableheader"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                }}
              >
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  Company <br /> Name
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  Year
                </Box>
                <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                  CEO <br /> Name
                </Box>
                <Box
                  sx={{
                    ...cellStyle,
                    backgroundColor: "#ff7f7f",
                  }}
                >
                  CEO Total Compensation
                </Box>
                <Box
                  sx={{
                    ...cellStyle,
                    backgroundColor: "#FCFAF6",
                  }}
                >
                  Frontline Worker Salary
                </Box>
              </Box>

              {/* Body */}
              {filteredData.map((row) => (
                <Box
                  key={row.id}
                  className="tablebody"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                  }}
                >
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.company_name}</Typography>
                  </Box>
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.year}</Typography>
                  </Box>
                  <Box sx={{ ...cellStyle, backgroundColor: "#FCFAF6" }}>
                    <Typography variant="h6">{row.ceo_name}</Typography>
                  </Box>
                  <Box
                    sx={{
                      ...cellStyle,
                      backgroundColor: "#FEC7C7",
                    }}
                  >
                    <Typography variant="h6">
                      {row.ceo_total_compensation}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ...cellStyle,
                      backgroundColor: "#FCFAF6",
                    }}
                  >
                    <Typography variant="h6">{row.worker_salary}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};