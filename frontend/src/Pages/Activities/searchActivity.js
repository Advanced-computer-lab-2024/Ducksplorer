import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
import ActivityCard from "../../Components/activityCard.js";
import {
  Stack,
  Typography,
  Box,
  Menu,
  MenuItem,
  Checkbox,
  Container,
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

function SearchActivity() {
  const { id } = useParams();

  const [searchQuery, setSearchQuery] = useState(""); // Single search input
  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const [activities, setActivities] = useState([]); // Displayed activities
  const [allActivities, setAllActivities] = useState([]); // Store all fetched activities  
  const isGuest = localStorage.getItem("guest") === "true";

  const errorMessage =
    "The activity you are looking for might be removed or is temporarily unavailable";
  const backMessage = "Back to search again";
  //filtering consts
  const [price, setPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [date, setDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [rating, setRating] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // All available categories from backend

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

  const [order, setOrder] = useState("asc"); // Default ascending order

  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [showError, setShowError] = useState(false);

  // Fetch all activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      const showPreferences = localStorage.getItem("showPreferences");
      const favCategory = localStorage.getItem("category");
      console.log(showPreferences, favCategory);
      try {
        const response = await axios.get("http://localhost:8000/activity/", {
          params: {
            showPreferences: showPreferences.toString(),
            favCategory,
          },
        });
        const data = response.data.map((activity) => ({
          ...activity,
          saved: activity.saved || { isSaved: false, user: null },
        }));
        if (id === undefined) {
          setAllActivities(data);
          setActivities(data); // Set initial activities to all fetched activities
        } else {
          const tempActivities = response.data.filter(
            (activity) => activity._id === id
          );
          setAllActivities(tempActivities);
          setActivities(tempActivities);
        }
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      }
    };
    fetchActivities();
  }, [id]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

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

  const handleSort = () => {
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    axios
      .get(
        `http://localhost:8000/activity/sort?sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        if (showPreferences === "true") {
          let Activities = response.data;
          Activities = Activities.sort((a, b) => {
            if (a.category === favCategory && b.category !== favCategory) {
              return -1; // "restaurant" category comes first
            } else if (
              b.category === favCategory &&
              a.category !== favCategory
            ) {
              return 1; // Move other categories after "restaurant"
            } else {
              return 0; // If both have the same category, retain their relative order
            }
          });
          Activities = response.data.map((activity) => ({
            ...activity,
            saved: activity.saved || { isSaved: false, user: null },
          }));
          setActivities(Activities);
        } else {
          setActivities(response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  // Function to fetch activities based on search criteria
  const handleSearchActivities = () => {
    const query = new URLSearchParams({
      search: searchQuery, // Single search query sent to the backend
    }).toString();

    axios
      .get(`http://localhost:8000/activity?${query}`)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  const isFilterSelected = (filter) => selectedFilters.includes(filter);

  const handleFilterChoiceClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  //price, date, category, averageRating
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
        case "category":
          setCategory("");
          break;
        case "date":
          setDate(null);
          break;
        case "averageRating":
          setRating(null);
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
    setDate(null);
    setRating([]);
    setCategories([]);
    setSelectedFilters([]);

    axios
      .get("http://localhost:8000/activity/")
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });

    handleFilterClose();
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  // const handleTagsChange = (event) => {
  //   const value = event.target.value;
  //   setTags(value);
  // };

  //for price slider
  const [anchorEl, setAnchorEl] = useState(null);

  const displayUpcomingActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/activity/upcoming"
      );
      const data = response.data.map((activity) => ({
        ...activity,
        saved: activity.saved || { isSaved: false, user: null },
      }));
      setAllActivities(data);
      setActivities(data);
    } catch (error) {
      console.error("There was an error fetching the activities!", error);
    }
  };

  //price, date, category, averageRating
  const handleFilter = () => {
    if (showUpcomingOnly) {
      displayUpcomingActivities();
      return;
    }
    const query = new URLSearchParams({
      price,
      date,
      category,
    }).toString();

    axios
      .get(`http://localhost:8000/activity/filter?${query}`)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  const fetchCategories = () => {
    if (categories.length === 0) { // Avoid redundant API calls
      axios
        .get("http://localhost:8000/category")
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the categories!", error);
        });
    }
  };


  useEffect(() => {
    if (activities.length === 0) {
      const timer = setTimeout(() => setShowError(true), 500); // Wait 0.5 second
      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or updates
    } else {
      setShowError(false); // Reset error state if activities exist
    }
  }, [activities]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "fff6e6",
        width: "100vw",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >
      <TouristNavBar />
      <Container sx={{ width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography class="bigTitle">Activities</Typography>
        </Box>


        <div
          style={{
            //div to surround search bar, button and the filter, and 2 sort icons
            display: "grid",
            gridTemplateColumns: "2.5fr 0.5fr auto auto",
            gap: "16px",
            paddingBottom: 24,
            width: "100%",
          }}
        >
          <Input
            placeholder="Search for an activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="filled"
            color="primary"
          />
          <Button
            variant="solid"
            onClick={handleSearchActivities}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Checkbox
                    checked={showUpcomingOnly}
                    onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                  />
                  <span>Upcoming Activities</span>
                </div>
              </MenuItem>

              <MenuItem>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Checkbox
                    checked={isFilterSelected("category")}
                    onChange={() => handleFilterToggle("category")}
                    paddingRight="40%"
                  />
                  Category
                  <br />
                  <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={category}
                      onChange={handleCategoryChange}
                      onOpen={fetchCategories} // Fetch categories when the dropdown is opened
                    >
                      {/* Map through the categories to generate MenuItems */}
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <MenuItem key={category._id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No categories available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
              </MenuItem>

              <MenuItem>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Checkbox
                    checked={isFilterSelected("rating")}
                    onChange={() => handleFilterToggle("rating")}
                    paddingRight="40%"
                  />
                  Rating
                  <FormControl sx={{ minWidth: 120, marginTop: 1 }}>
                    <InputLabel id="rating-select-label">Rating</InputLabel>
                    <Select
                      labelId="rating-select-label"
                      id="rating-select"
                      value={rating}
                      onChange={handleRatingChange}
                    >
                      {[0, 1, 2, 3, 4, 5].map((ratingValue) => (
                        <MenuItem key={ratingValue} value={ratingValue}>
                          {ratingValue}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </MenuItem>

              <MenuItem>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Checkbox
                    checked={isFilterSelected("date")}
                    onChange={() =>
                      handleFilterToggle("date")
                    }
                  />
                  Date
                  <br />
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)} // Update the state with the selected date
                    style={{ marginTop: "10px" }}
                  />
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

            <IconButton onClick={handleSortByClick}>
              <SortIcon sx={{ color: "black" }} />
            </IconButton>
            <Menu
              anchorEl={sortByAnchorEl}
              open={Boolean(sortByAnchorEl)}
              onClose={handleSortByClose}
            >
              <MenuItem
                value="date"
                onClick={() => {
                  setSortBy("date");
                  handleSort("date", sortOrder);
                  handleSortByClose();
                }}
              >
                Date
              </MenuItem>
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
                value="name"
                onClick={() => {
                  setSortBy("name");
                  handleSort("name", sortOrder);
                  handleSortByClose();
                }}
              >
                Name
              </MenuItem>
              <MenuItem
                value="duration"
                onClick={() => {
                  setSortBy("duration");
                  handleSort("duration", sortOrder);
                  handleSortByClose();
                }}
              >
                Duration
              </MenuItem>
              <MenuItem
                value="category"
                onClick={() => {
                  setSortBy("category");
                  handleSort("category", sortOrder);
                  handleSortByClose();
                }}
              >
                Category
              </MenuItem>
              <MenuItem
                value="specialDiscount"
                onClick={() => {
                  setSortBy("specialDiscount");
                  handleSort("specialDiscount", sortOrder);
                  handleSortByClose();
                }}
              >
                Discount
              </MenuItem>
              <MenuItem
                value="averageRating"
                onClick={() => {
                  setSortBy("averageRating");
                  handleSort("averageRating", sortOrder);
                  handleSortByClose();
                }}
              >
                Rating
              </MenuItem>
            </Menu>

            {/* Sort Order Menu */}
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

        {activities.length > 0 ? (
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px", // Adjust the gap between items as needed
              paddingBottom: 24,
            }}
          >
            {activities.map((activity) =>
              !activity.flag &&
                !activity.isDeactivated &&
                !activity.tourGuideDeleted &&
                !activity.deletedActivity ? (
                <ActivityCard key={activity._id} activity={activity} />
              ) : null
            )}
          </div>
        ) : (
          showError && (
            <Error404
              errorMessage={errorMessage}
              backMessage={backMessage}
              route="/activity/searchActivities" // Change route for activities
            />
          )
        )}
        <Help />
      </Container>
    </Box>
  );
}

export default SearchActivity;
