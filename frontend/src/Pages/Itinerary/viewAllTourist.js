import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import ItineraryCard from "../../Components/itineraryCard.js";
import {
  Stack,
  Typography,
  Box,
  Menu,
  MenuItem,
  Checkbox,
  Slider,
  Select,
  IconButton,
  FormControl,
  InputLabel,
  Rating,
  Grid2,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Link, useParams } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor.js";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import SortIcon from "@mui/icons-material/Sort";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Error404 from "../../Components/Error404.js";

function SearchItineraries() {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const [itineraries, setItineraries] = useState([]);
  const isGuest = localStorage.getItem("guest") === "true";

  const errorMessage = "The itinerary you are looking for might be removed or is temporarily unavailable";
  const backMessage = "Back to search again";
  //filtering consts
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [language, setLanguage] = useState("");
  const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [tags, setTags] = useState([]); // Tags selected by the user
  const [allTags, setAllTags] = useState([]); // All available tags from backend

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  const [activityExchangeRates, setActivityExchangeRates] = useState({});
  const [activityCurrency, setActivityCurrency] = useState("EGP");

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [isSaved, setIsSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  //sorting consts
  const [sortBy, setSortBy] = useState("price"); // Default to 'price'
  const [sortOrder, setSortOrder] = useState("asc"); // Default to 'asc'

  const [sortByAnchorEl, setSortByAnchorEl] = useState(null);
  const [sortOrderAnchorEl, setSortOrderAnchorEl] = useState(null);

  //default rendering of all itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      const showPreferences = localStorage.getItem("showPreferences");
      const user = JSON.parse(localStorage.getItem("user"));

      const username = user?.username;
      const role = user?.role;
      try {
        const response = await axios.get("http://localhost:8000/itinerary/", {
          params: {
            showPreferences: showPreferences.toString(),
            username,
            role,
          },
        });
        const data = response.data.map((itinerary) => ({
          ...itinerary,
          saved: itinerary.saved || { isSaved: false, user: null },
        }));
        if (id === undefined) {
          setItineraries(data);
        } else {
          const tempItineraries = data.filter(
            (itinerary) => itinerary._id === id
          );
          setItineraries(tempItineraries);
        }
      } catch (error) {
        console.error("There was an error fetching the itineraries!", error);
      }
    };
    fetchItineraries();
  }, [id]);

  // Handlers for Sort By dropdown
  const handleSortByClick = (event) => {
    setSortByAnchorEl(event.currentTarget);
  };
  const handleSortByClose = () => {
    setSortByAnchorEl(null);
  };

  // Handlers for Sort Order dropdown
  const handleSortOrderClick = (event) => {
    setSortOrderAnchorEl(event.currentTarget);
  };
  const handleSortOrderClose = () => {
    setSortOrderAnchorEl(null);
  };

  const handleSort = (sortBy, sortOrder) => {
    axios
      .get(
        `http://localhost:8000/itinerary/sort?sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        message.error("Error fetching itineraries!");
      });
  };

  //search handler
  const handleSearchItineraries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/itinerary/search",
        {
          params: {
            searchTerm,
          },
        }
      );

      if (response.status === 200) {
        setItineraries(response.data);
      } else {
        message.error("Failed to search itineraries");
      }
    } catch (error) {
      message.error(" No itineraries found ");
    }
  };

  //filtering handlers

  //get all pref tags from table
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/preferenceTags/");
        const data = await response.json();
        setAllTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const isFilterSelected = (filter) => selectedFilters.includes(filter);

  const handleFilterChoiceClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterToggle = (filter) => {
    const newFilters = [...selectedFilters];
    if (newFilters.includes(filter)) {
      // Remove filter if it's already selected
      const index = newFilters.indexOf(filter);
      newFilters.splice(index, 1);

      switch (filter) {
        case "minPrice":
          setMinPrice("");
          break;
        case "maxPrice":
          setMaxPrice("");
          break;
        case "language":
          setLanguage("");
          break;
        case "availableDatesAndTimes":
          setAvailableDatesAndTimes(null);
          break;
        default:
          break;
      }
    } else {
      // Add filter if not selected
      newFilters.push(filter);
    }
    setSelectedFilters(newFilters);
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
  //clear all filters
  const handleClearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setLanguage("");
    setAvailableDatesAndTimes(null);
    setSelectedFilters([]);
    setTags([]);

    axios
      .get("http://localhost:8000/itinerary/")
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the itineraries!", error);
      });

    handleFilterClose();
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleTagsChange = (event) => {
    const value = event.target.value;
    setTags(value);
  };

  //for price slider
  const [anchorEl, setAnchorEl] = useState(null);

  //encoding tags
  const encodeTags = (tags) => {
    if (Array.isArray(tags)) {
      return tags.map((tag) => encodeURIComponent(tag));
    }
    return encodeURIComponent(tags);
  };

  const displayUpcomingItineraries = async () => {
    const showPreferences = localStorage.getItem("showPreferences");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;
    const role = user?.role;
    try {
      const response = await axios.get(
        "http://localhost:8000/itinerary/upcoming",
        {
          params: {
            showPreferences: showPreferences.toString(),
            username,
            role,
          },
        }
      );
      console.log("res is", response.data);
      setItineraries(() => response.data);
    } catch (error) {
      console.error("There was an error fetching the itineraries!", error);
    }
    console.log("Displaying Upcoming Itineraries");
  };

  //filter by price, lang, or dates
  const handleFilter = async () => {
    if (showUpcomingOnly) {
      await displayUpcomingItineraries();
      return;
    }
    let dateQuery = "";
    const encodedTags = encodeTags(tags).join(",");

    if (availableDatesAndTimes) {
      // Try to convert availableDatesAndTimes to a Date object
      const selectedDate = new Date(availableDatesAndTimes);

      // Check if the conversion is successful and the date is valid
      if (!isNaN(selectedDate.getTime())) {
        dateQuery = selectedDate.toISOString();
      }
    }
    axios
      .get(
        `http://localhost:8000/itinerary/filter?minPrice=${minPrice}&maxPrice=${maxPrice}&language=${language}&availableDatesAndTimes=${dateQuery}&tags=${encodedTags}`
      )
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        message.error("Error fetching itineraries!");
      });
    handleFilterClose();
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  return (
    <div>
      <TouristNavBar />
      {/* <TouristSidebar /> */}
      <Box
        sx={{
          padding: "20px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          overflowY: "visible",
          height: "100vh",
        }}
      >

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4"> Itineraries</Typography>
        </Box>

        <div
          style={{
            //div to surround search bar, button and the filter, and 2 sort icons
            display: "grid",
            gridTemplateColumns: "3fr 0.5fr auto",
            gap: "16px", 
            paddingBottom: 24,
          }}
        >
          <Input
            placeholder="Enter Name or Category or Tag"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="filled"
            color="primary"
          />
          <Button
            variant="solid"
            onClick={handleSearchItineraries}
            className="blackhover"
            sx={{ backgroundColor: "#ff9933" }}
          >
            Search
          </Button>

          <div>
            {/* Filtering */}
            <IconButton onClick={handleFilterChoiceClick}>
              {" "}
              {/* try to make it on the right later */}
              <FilterAltIcon sx={{ color: "black" }} />
            </IconButton>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Checkbox
                    checked={showUpcomingOnly}
                    onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                  />
                  <span>Upcoming Itineraries Only</span>
                </div>
              </MenuItem>

              <MenuItem>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Checkbox
                    checked={isFilterSelected("price")}
                    onChange={(e) => {
                      handleFilterToggle("price");
                      if (!e.target.checked) {
                        // Reset price filters if unchecked
                        setMinPrice("");
                        setMaxPrice("");
                        setPriceRange([0, 5000]); // Reset the slider to initial values
                      }
                    }}
                  />
                  <span>Price </span>
                  <br />
                  <Button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    className="blackhover"
                    sx={{ backgroundColor: "#ff9933" }}
                  >
                    Select Price Range
                  </Button>
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem>
                    <Typography variant="subtitle1">Select Range:</Typography>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={5000}
                      sx={{ width: 300, marginLeft: 2, marginTop: "10px" }} // Adjust slider width and margin
                    />
                  </MenuItem>
                  <MenuItem>
                    <Typography variant="body1">
                      Selected Min: {priceRange[0]}
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography variant="body1">
                      Selected Max: {priceRange[1]}
                    </Typography>
                  </MenuItem>
                </Menu>
              </MenuItem>

              <MenuItem>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Checkbox
                    checked={isFilterSelected("language")}
                    onChange={() => handleFilterToggle("language")}
                    paddingRight="40%"
                  />
                  Language
                  <br />
                  <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                      labelId="language-select-label"
                      id="language-select"
                      value={language}
                      onChange={handleLanguageChange}
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Arabic">Arabic</MenuItem>
                      <MenuItem value="German">German</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="Japanese">Japanese</MenuItem>
                      <MenuItem value="Russian">Russian</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </MenuItem>

              <MenuItem>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Checkbox
                    checked={isFilterSelected("availableDatesAndTimes")}
                    onChange={() =>
                      handleFilterToggle("availableDatesAndTimes")
                    }
                  />
                  Dates & Times
                  <br />
                  <input
                    type="datetime-local"
                    value={availableDatesAndTimes}
                    onChange={(e) => setAvailableDatesAndTimes(e.target.value)} // Update the state with the selected date
                    style={{ marginTop: "10px" }}
                  />
                </div>
              </MenuItem>

              <MenuItem>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Checkbox
                    checked={isFilterSelected("tags")}
                    onChange={() => handleFilterToggle("tags")}
                  />
                  <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                    <InputLabel id="tags-select-label">Tags</InputLabel>
                    <Select
                      labelId="tags-select-label"
                      id="tags-select"
                      multiple
                      value={tags}
                      onChange={handleTagsChange}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {allTags.map((tag) => (
                        <MenuItem key={tag._id} value={tag.name}>
                          <Checkbox checked={tags.indexOf(tag.name) > -1} />
                          {tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </MenuItem>

              <MenuItem sx={{ alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <Button
                    onClick={handleFilter}
                    className="blackhover"
                    sx={{
                      backgroundColor: "#ff9933",
                      alignSelf: "center",
                      justifySelf: "center",
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </MenuItem>
              <MenuItem sx={{ alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={handleClearAllFilters}
                    className="blackhover"
                    sx={{
                      backgroundColor: "#ff9933",
                      alignSelf: "center",
                      justifySelf: "center",
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </MenuItem>
            </Menu>

            {/* SORTING */}
            <IconButton onClick={handleSortByClick}>
              <SortIcon sx={{ color: "black" }} />
            </IconButton>
            <Menu
              anchorEl={sortByAnchorEl}
              open={Boolean(sortByAnchorEl)}
              onClose={handleSortByClose}
            >
              <MenuItem
                value="price"
                onClick={() => {
                  setSortBy("price");
                  handleSort("price", sortOrder);
                  handleSortByClose();
                }}
              >
                Price
              </MenuItem>
              <MenuItem
                value="rating"
                onClick={() => {
                  setSortBy("rating");
                  handleSort("rating", sortOrder);
                  handleSortByClose();
                }}
              >
                Rating
              </MenuItem>
            </Menu>

            <IconButton onClick={handleSortOrderClick}>
              <SwapVertIcon sx={{ color: "black" }} />
            </IconButton>
            <Menu
              anchorEl={sortOrderAnchorEl}
              open={Boolean(sortOrderAnchorEl)}
              onClose={handleSortOrderClose}
            >
              <MenuItem
                value="asc"
                onClick={() => {
                  setSortOrder("asc");
                  handleSort(sortBy, "asc");
                  handleSortOrderClose();
                }}
              >
                Ascending
              </MenuItem>
              <MenuItem
                value="desc"
                onClick={() => {
                  setSortOrder("desc");
                  handleSort(sortBy, "desc");
                  handleSortOrderClose();
                }}
              >
                Descending
              </MenuItem>
            </Menu>
          </div>
          {/* for the three icons */}
        </div>

        {itineraries.length > 0 ? (
          <div
            style={{
              width: "90vw",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px", // Adjust the gap between items as needed
              paddingBottom: 24,
            }}
          >
            {console.log("these are the itineraries", itineraries)}
            {
              itineraries.map((itinerary) =>
                itinerary.flag === false &&
                  itinerary.isDeactivated === false &&
                  itinerary.tourGuideDeleted === false &&
                  itinerary.deletedItinerary === false ? (
                  <ItineraryCard itinerary={itinerary} />
                ) : null
              ) // We don't output a row when it has `itinerary.flag` is true (ie itinerary is inappropriate) or when the itinerary is inactive or its tour guide has left the system  or the itinerary has been deleted but cannot be removed from database since it is booked my previous tourists
            }
          </div>
        ) : (
          <Error404 errorMessage={errorMessage} backMessage={backMessage} route="/viewAllTourist" />
        )}
        <Help />
      </Box>
    </div>
  );
}

export default SearchItineraries;
