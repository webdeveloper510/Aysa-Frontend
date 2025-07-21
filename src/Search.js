import React, { useState, useEffect } from "react";
import axios from "axios";
import Suggestions from "./Suggestions";
import OrientationResults from "./OrientationResults";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Search({ onProductSelect }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [screenOrientation, setScreenOrientation] = useState("landscape");
  const [allTypes, setAllTypes] = useState({});
  const [chosenProduct, setChosenProduct] = useState({});
  const [chosenYear, setChosenYear] = useState("");
  const [versions, setVersions] = useState({});
  const [chosenVersion, setChosenVersion] = useState({});
  const [version, setVersion] = useState("");

  useEffect(() => {
    serverCallForAutocomplete("");
  }, []);

  const changeScreenOrientation = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      setScreenOrientation("portrait");
    }
    if (window.matchMedia("(orientation: landscape)").matches) {
      setScreenOrientation("landscape");
    }
  };

  const prettyPlease = (e) => {
    if (document.getElementById("clickbox").contains(e.target)) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  window.addEventListener("resize", changeScreenOrientation);
  useEffect(() => {
    changeScreenOrientation();
  }, []);
  useEffect(() => {
    if (prettyPlease) {
      document.addEventListener("click", prettyPlease);
    }

    return () => {
      document.removeEventListener("click", prettyPlease);
    };
  }, []);

  const handleYearChange = (event) => {
    setChosenYear(event.target.value);
    let element = allTypes.find((el) => el.year == event.target.value);
    if (element) {
      setVersions(element.items);
      let newVersion = element.items.find((el) => el.version == version);
      if (newVersion) {
        setChosenVersion(newVersion);
        setVersion(newVersion.version);
      } else {
        let found = element.items.find((el) => el.version == "default");
        if (found) {
          setChosenVersion(found);
          setVersion(found.version);
        } else {
          setChosenVersion(element.items[0]);
          setVersion(element.items[0].version);
        }
      }
    }
  };

  const handleVersionChange = (event) => {
    let newVersion = versions.find((el) => el.version == event.target.value);
    if (newVersion) {
      setChosenVersion(newVersion);
      setVersion(newVersion.version);
    } else {
      setVersion(event.target.value);
    }
  };

  const serverCallForAutocomplete = (userInput) => {
    axios
      .post("https://api.the-aysa.com/product-semantic-search", {
        names: userInput.split(" "),
      })
      .then((res) => {
        let newSuggestions = [];
        res.data.products.forEach((element) => {
          newSuggestions.push(element);
        });
        setSuggestions(newSuggestions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFocus = () => {
    setShowResults(true);
  };

  const processData = (data, version) => {
    setAllTypes(data);
    let year = 0;
    let display = {};
    for (const element of data) {
      if (element.year > year) {
        year = element.year;
        display = element;
      }
    }
    setChosenYear(year);
    setVersions(display.items);
    let found = display.items.find((el) => el.version == version);
    if (found) {
      setChosenVersion(found);
    } else {
      setChosenVersion(display.items[0]);
      setVersion(display.items[0].version);
    }
  };

  const serverCallForItem = (id, version) => {
    if (id !== undefined) {
      axios.get("http://localhost:3000/products/".concat(id)).then((res) => {
        processData(res.data, version);
      });
    }
  };

  const chooseValue = (id, version) => () => {
    const selected = suggestions[suggestionIndex];
    setChosenProduct(selected);
    setSearchInput("");
    setSuggestionIndex(0);
    setSuggestions([]);
    document.activeElement.blur();
    setShowResults(false);
    setVersion(version);

    serverCallForItem(id, version);
    serverCallForAutocomplete("");

    // 🔥 Trigger callback to parent (TabOne) for external API call
    if (onProductSelect) {
      const selectedName = selected.product;
      onProductSelect(selectedName);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    serverCallForAutocomplete(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 38) {
      e.preventDefault();
      if (suggestionIndex === 0) return;
      setSuggestionIndex(suggestionIndex - 1);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      if (suggestionIndex === suggestions.length) return;
      setSuggestionIndex(suggestionIndex + 1);
    } else if (e.keyCode === 13) {
      if (suggestions[suggestionIndex] !== undefined) {
        chooseValue(
          suggestions[suggestionIndex].product_id,
          suggestions[suggestionIndex].version
        )();
      }
    }
  };

  return (
    <div className="test">
      {!chosenVersion.product_info_id && (
        <div>
          <div className="buffer"></div>
          <p></p>
        </div>
      )}
      <div
        className={
          screenOrientation === "landscape" ? "meoww" : "outside-search-phone"
        }
      >
        <div
          className={
            screenOrientation === "landscape" ? "meow" : "search-phone"
          }
        >
          <div id="clickbox">
            <div onFocus={onFocus}>
              <input
                type="text"
                placeholder="Discover the profit margin of any product"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={searchInput}
                className="input-form"
              />
            </div>
            {suggestions.length > 0 && showResults && (
              <div className="finally">
                <div
                  className={
                    screenOrientation === "landscape"
                      ? "display-autocomplete"
                      : "display-autocomplete-phone"
                  }
                >
                  <Suggestions
                    suggestions={suggestions}
                    suggestionIndex={suggestionIndex}
                    chooseValue={chooseValue}
                    setSuggestionIndex={setSuggestionIndex}
                    order={0}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {chosenVersion.product_info_id && (
        <div>
          <div className="test">
            <h1 className="autocomplete-headline">
              {chosenProduct.company.concat(" ").concat(chosenProduct.product)}
            </h1>
          </div>
          <div className="select">
            <div className="select-row">
              <div className="right">
                <Box sx={{ minWidth: 100, maxWidth: 200 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Version
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={version}
                      label="Version"
                      onChange={handleVersionChange}
                    >
                      {versions.map((item) => (
                        <MenuItem key={item.version} value={item.version}>
                          {item.version}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div className="left">
                <Box sx={{ minWidth: 100, maxWidth: 200 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={chosenYear}
                      label="Year"
                      onChange={handleYearChange}
                    >
                      {allTypes.map((item) => (
                        <MenuItem key={item.year} value={item.year}>
                          {item.year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
          </div>
        </div>
      )}

      {chosenVersion.product_info_id && (
        <OrientationResults item={chosenVersion} />
      )}
    </div>
  );
}
