import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TouristNavBar from "../../Components/TouristNavBar";
import ActivityCard from "../../Components/activityCard.js";
import Error404 from "../../Components/Error404";
import GuestNavBar from "../../Components/NavBars/GuestNavBar.js";
import UpdateIcon from "@mui/icons-material/Update";
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
  Tooltip,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Help from "../../Components/HelpIcon.js";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DuckLoading from "../../Components/Loading/duckLoading";

function SearchActivity() {
  const { id } = useParams();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Single search input
  const [searchTerm, setSearchTerm] = useState(""); // Single search term
  const [activities, setActivities] = useState([]); // Displayed activities
  const isGuest = localStorage.getItem("guest") === "true";

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  const errorMessage =
    "The activity you are looking for might be removed or is temporarily unavailable";
  const backMessage = "Back to search again";
  //filtering consts
  const [rating, setRating] = useState(null);

  const initialCurrency = "USD"; // Set initial currency
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState(initialCurrency);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order
  const [activityExchangeRates, setActivityExchangeRates] = useState(null);
  const [activityCurrency, setActivityCurrency] = useState(null);

  //for price slider
  const [anchorEl, setAnchorEl] = useState(null);

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  

  //sorting consts
  const [sortOrder, setSortOrder] = useState("desc"); // Default to 'asc'

  const [sortByAnchorEl, setSortByAnchorEl] = useState(null);
  const [sortOrderAnchorEl, setSortOrderAnchorEl] = useState(null);

  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [showError, setShowError] = useState(false);
  const [allOrUpcoming, setAllOrUpcoming] = useState(false);

  // Fetch all activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      const showPreferences = localStorage.getItem("showPreferences");
      const favCategory = localStorage.getItem("category");
      console.log(showPreferences, favCategory);
      setLoading(true);
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
          setActivities(data); // Set initial activities to all fetched activities
        } else {
          const tempActivities = response.data.filter(
            (activity) => activity._id === id
          );
          setActivities(tempActivities);
        }
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Delay of 1 second
      }
    };
    fetchActivities();
  }, [id]);

  useEffect(() => {
    const fetchCategories = () => {
      if (categories.length === 0 && !loading) {
        // Avoid redundant calls
        setLoading(true);
        axios
          .get(`http://localhost:8000/category`) // Use environment variable for the base URL
          .then((response) => {
            setCategories(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
            setError("Failed to fetch categories.");
          })
          .finally(() => setLoading(false));
      }
    };
    fetchCategories();
  });

  useEffect(() => {
    if (activities.length === 0) {
      const timer = setTimeout(() => setShowError(true), 100); // Wait 0.5 second
      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or updates
    } else {
      setShowError(false); // Reset error state if activities exist
    }
  }, [activities]);

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
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/activity/sort?sortBy=${sortBy}&order=${sortOrder}`
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
      })
      .finally(() => setLoading(false));
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
    if (filterAnchorEl === event.currentTarget) {
      setFilterAnchorEl(null);
    } else {
      setFilterAnchorEl(event.currentTarget);
    }
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
        case "price":
          setPrice("");
          break;
        case "category":
          setCategories("");
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

  const handleCurrencyChange = useCallback((rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  }, []);

  const convertPrice = (price, fromCurrency) => {
    if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[currency]) {
      return price;
    }
    const rate = exchangeRates[currency] / exchangeRates[fromCurrency];
    return (price * rate).toFixed(2);
  };

  //clear all filters
  const handleClearAllFilters = () => {
    setPrice("");
    setDate(null);
    setRating([]);
    setCategories([]);
    setShowUpcomingOnly(false);
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selected category
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleGetUpcomingActivities = async (event) => {
    if(!allOrUpcoming){
      try {
        const response = await axios.get(
          "http://localhost:8000/activity/upcoming"
        );
        const data = response.data.map((activity) => ({
          ...activity,
          saved: activity.saved || { isSaved: false, user: null },
        }));
        setActivities(data); // Updates the state with the fetched activities
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      }
    }else{
      const showPreferences = localStorage.getItem("showPreferences");
      const favCategory = localStorage.getItem("category");
      console.log(showPreferences, favCategory);
      setLoading(true);
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
          setActivities(data); // Set initial activities to all fetched activities
        } else {
          const tempActivities = response.data.filter(
            (activity) => activity._id === id
          );
          setActivities(tempActivities);
        }
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Delay of 1 second
      }
    }
    setAllOrUpcoming(!allOrUpcoming);
    
  };

  const displayUpcomingActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/activity/upcoming"
      );
      const data = response.data.map((activity) => ({
        ...activity,
        saved: activity.saved || { isSaved: false, user: null },
      }));
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

    const query = new URLSearchParams();
    if (price) query.append("price", price);
    if (date) query.append("date", date);
    if (selectedCategory) query.append("category", selectedCategory);
    if (rating) query.append("averageRating", rating);

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

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "fff6e6",
        width: "100vw",
        paddingTop: "2vh", // Adjust for navbar height
      }}
    >

        {isGuest === true ? (
          <GuestNavBar onCurrencyChange={handleCurrencyChange} /> 
        ) : (
          <TouristNavBar onCurrencyChange={handleCurrencyChange} /> 
        )}      
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
            value={searchQuery} // Use searchQuery here
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery instead of searchTerm
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
            <Tooltip title={allOrUpcoming ? "All Activities" : "Upcoming Activities"}>
              <IconButton onClick={handleGetUpcomingActivities}>
                {" "}
                {/* try to make it on the right later */}
                <UpdateIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter Activities">
              <IconButton onClick={handleFilterChoiceClick}>
                {" "}
                {/* try to make it on the right later */}
                <FilterAltIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                style: {
                  position: "absolute",
                },
              }}
            >
              <MenuItem
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Checkbox
                    style={{ color: "#ff9933" }}
                    checked={isFilterSelected("price")}
                    onChange={(e) => {
                      handleFilterToggle("price");
                      if (!e.target.checked) {
                        // Reset price filters if unchecked
                        setPrice("");
                      }
                    }}
                  />
                  <span>Price </span>
                  <br />
                </div>
                <Input
                  placeholder="Enter a price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  variant="filled"
                  color="#ff9933"
                />
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
                    style={{ color: "#ff9933" }}
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
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#ff9933", // Set border color to orange
                          },
                          "&:hover fieldset": {
                            borderColor: "#ff9933", // Set border color on hover
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff9933", // Set border color when focused
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "black", // Change the text color to match the orange theme if needed
                        },
                      }}
                    >
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
                    style={{ color: "#ff9933" }}
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
                    style={{ color: "#ff9933" }}
                    checked={isFilterSelected("date")}
                    onChange={() => handleFilterToggle("date")}
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
            <Tooltip title="Sort Activities">
              <IconButton onClick={handleSortByClick}>
                <SortIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>
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
            <Tooltip title="Sort Order">
              <IconButton onClick={handleSortOrderClick}>
                <SwapVertIcon sx={{ color: "black" }} />
              </IconButton>
            </Tooltip>
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
                <ActivityCard key={activity._id} activity={{ ...activity, price: convertPrice(activity.price, "USD") }} />
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
