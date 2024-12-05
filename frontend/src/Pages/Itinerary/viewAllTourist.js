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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Link, useParams } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor.js";
import Help from "../../Components/HelpIcon.js";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TouristNavBar from "../../Components/TouristNavBar";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

function SearchItineraries() {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const [itineraries, setItineraries] = useState([]);
  const isGuest = localStorage.getItem("guest") === "true";

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

  //filter by price, lang, or dates
  const handleFilter = () => {
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

  // Share itinerary functionality
  const handleShareLink = (itineraryId) => {
    const link = `${window.location.origin}/viewAllTourist/${itineraryId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (itineraryId) => {
    const link = `${window.location.origin}/viewAllTourist/${itineraryId}`; // Update with your actual route
    window.location.href = `mailto:?subject=Check out this itinerary&body=Here is the link to the itinerary: ${link}`;
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  const handleSaveItinerary = async (itineraryId, currentIsSaved) => {
    try {
      const newIsSaved = !currentIsSaved;

      const response = await axios.put(
        `http://localhost:8000/itinerary/save/${itineraryId}`,
        {
          username: username,
          save: newIsSaved,
        }
      );
      if (response.status === 200) {
        message.success("Itinerary saved successfully");
        setItineraries((prevItineraries) =>
          prevItineraries.map((itinerary) =>
            itinerary._id === itineraryId
              ? {
                ...itinerary,
                saved: { ...itinerary.saved, isSaved: newIsSaved },
              }
              : itinerary
          )
        );
      } else {
        message.error("Failed to save");
      }
      setIsSaved(isSaved);
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  const [saveStates, setSaveStates] = useState({});

  useEffect(() => {
    const fetchSaveStates = async () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;

      // Loop through itineraries to fetch save states
      const newSaveStates = {};
      await Promise.all(
        itineraries.map(async (itinerary) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/itinerary/getSave/${itinerary._id}/${userName}`
            );

            if (response.status === 200) {
              newSaveStates[itinerary._id] = response.data.saved; // Save the state
            }
          } catch (error) {
            console.error(
              `Failed to fetch save state for ${itinerary._id}:`,
              error
            );
          }
        })
      );

      setSaveStates(newSaveStates); // Update state with all fetched save states
    };

    if (itineraries.length > 0) {
      fetchSaveStates();
    }
  }, [itineraries]);

  return (
    <div>
      <TouristNavBar />
      <TouristSidebar />
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
        <Link
          to={isGuest ? "/guestDashboard" : "/touristDashboard"}
          className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
        >
          Back
        </Link>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4"> Itineraries</Typography>
        </Box>
        <Stack spacing={2} style={{ marginBottom: "20px" }}>
          <Input
            placeholder="Enter Name or Category or Tag"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            color="primary"
          />
          <Button
            variant="solid"
            color="primary"
            onClick={handleSearchItineraries}
          >
            Search
          </Button>

          {/* Filtering */}
          <IconButton onClick={handleFilterChoiceClick}>
            {" "}
            {/* try to make it on the right later */}
            <FilterAltIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem>
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
              Price
              <br />
              <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
                Select Price Range
              </Button>
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
                </Select>
              </FormControl>
            </MenuItem>

            <MenuItem>
              <Checkbox
                checked={isFilterSelected("availableDatesAndTimes")}
                onChange={() => handleFilterToggle("availableDatesAndTimes")}
              />
              Dates & Times
              <br />
              <input
                type="datetime-local"
                value={availableDatesAndTimes}
                onChange={(e) => setAvailableDatesAndTimes(e.target.value)} // Update the state with the selected date
                style={{ marginTop: "10px" }}
              />
            </MenuItem>

            <MenuItem>
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
            </MenuItem>

            <MenuItem>
              <Button onClick={handleFilter}>Apply Filters</Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={handleClearAllFilters}>Clear All Filters</Button>
            </MenuItem>
          </Menu>
        </Stack>

        {itineraries.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px", // Adjust the gap between items as needed
              paddingBottom: 24,
            }}
          >
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
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No itineraries found.
          </Typography>
        )}
        <Help />
      </Box>
    </div>
  );
}

export default SearchItineraries;
