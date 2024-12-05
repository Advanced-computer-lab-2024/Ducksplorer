import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  Menu,
  Checkbox,
  Slider,
  Button,
  FormControl,
  InputLabel,
  Select,
  Rating,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import ItineraryCard from "../../Components/itineraryCard.js";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const ViewUpcomingItinerary = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);

  //sorting consts
  const [sortBy, setSortBy] = useState("price"); // Default to 'price'
  const [sortOrder, setSortOrder] = useState("asc"); // Default to 'asc'

  const [sortByAnchorEl, setSortByAnchorEl] = useState(null);
  const [sortOrderAnchorEl, setSortOrderAnchorEl] = useState(null);

  //filtering consts
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [language, setLanguage] = useState("");
  const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [tags, setTags] = useState([]); // Tags selected by the user
  const [allTags, setAllTags] = useState([]); // All available tags from backend
  const isGuest = localStorage.getItem("guest") === "true";

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [activityExchangeRates, setActivityExchangeRates] = useState({});
  const [activityCurrency, setActivityCurrency] = useState("EGP");

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [isSaved, setIsSaved] = useState(false);

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

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
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

  //Filtering handlers
  const handleFilterChoiceClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleTagsChange = (event) => {
    const value = event.target.value;
    setTags(value); // Ensure tags is always an array
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

  //clear all filters
  const handleClearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setLanguage("");
    setAvailableDatesAndTimes(null);
    setSelectedFilters([]);
    setTags([]);

    axios
      .get("http://localhost:8000/itinerary/upcoming")
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

  //for price slider
  const [anchorEl, setAnchorEl] = useState(null);

  //get upcoming itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
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
        const data = response.data.map((itinerary) => ({
          ...itinerary,
          saved: itinerary.saved || { isSaved: false, user: null },
        }));
        setItineraries(data);
      } catch (error) {
        console.error("There was an error fetching the itineraries!", error);
      }
    };
    fetchItineraries();
  }, []);

  //get itineraries based on the sorting criteria
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
        `http://localhost:8000/itinerary/filterUpcoming?minPrice=${minPrice}&maxPrice=${maxPrice}&language=${language}&availableDatesAndTimes=${dateQuery}&tags=${encodedTags}`
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

  const handleBooking = async (itineraryId) => {
    try {
      const userJson = localStorage.getItem("user");
      const isGuest = localStorage.getItem("guest") === "true";
      if (isGuest) {
        message.error("Can't book as a guest, Please login or sign up.");
        navigate("/guestDashboard");
        return;
      }
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }
      // const userName = user.username;
      const type = "itinerary";

      localStorage.setItem("itineraryId", itineraryId);
      localStorage.setItem("type", type);

      const response = await axios.get(
        `http://localhost:8000/touristRoutes/viewDesiredItinerary/${itineraryId}`
      );

      if (response.status === 200) {
        navigate("/payment");
      } else {
        message.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };

  const handleSaveItinerary = async (itineraryId, currentIsSaved) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;
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
          <Typography variant="h4">Upcoming Itineraries</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "normal", mb: 2 }}>
          {/* Sort By Icon Button */}
          <IconButton onClick={handleSortByClick}>
            <SortIcon />
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
            <SwapVertIcon />
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

          {/* Filtering */}
          <IconButton onClick={handleFilterChoiceClick}>
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
                  <Typography variant="subtitle1">Select Range:</Typography> {" "}
                  <Slider
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000}
                    sx={{ width: 300, marginLeft: 2 }} // Adjust slider width and margin
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
              />
              Language
              <br />
              <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                <InputLabel id="language-select-label" sx={{ marginRight: 2 }}> Language </InputLabel>
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
                  value={tags} // Ensure it's an array
                  onChange={handleTagsChange}
                  renderValue={(selected) => selected.join(", ")} // Display selected tags
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
        </Box>

        {itineraries.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px", // Adjust the gap between items as needed
              paddingBottom: 24,
            }}
          >
            {itineraries.map((itinerary) =>
              itinerary.flag === false &&
                itinerary.isDeactivated === false &&
                itinerary.tourGuideDeleted === false &&
                itinerary.deletedItinerary === false ? (
                <ItineraryCard itinerary={itinerary} />
              ) : null
            )}
          </div>
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No itineraries found.
          </Typography>
        )}

        <Help />

        {/* <TableCell>
                                          <span
                                            onClick={() => handleSaveItinerary(itinerary._id, itinerary.saved?.isSaved)}
                                          >
                                            {saveStates[itinerary._id] ? (
                                              <IconButton>
                                                <BookmarkIcon />
                                              </IconButton>
                                            ) : (
                                              <IconButton>
                                                <BookmarkBorderIcon />
                                              </IconButton>
                                            )}
                                          </span>
                                        </TableCell> */}
      </Box>
    </div>
  );
};

export default ViewUpcomingItinerary;
