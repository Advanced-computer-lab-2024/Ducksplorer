// This is the file that gets all the activities for the tourist
import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import {
  Box,
  Table,
  Typography,
  Rating,
  IconButton,
  Container,
  Grid,
  Slider,
  FormControl
} from "@mui/material";
import ActivityCard from "../../Components/activityCard";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { selectClasses } from "@mui/joy/Select";

import { Link, useParams } from "react-router-dom";

// import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";


const SearchActivities = () => {
  const { id } = useParams();

  const [activities, setActivities] = useState([]); // Displayed activities
  const [allActivities, setAllActivities] = useState([]); // Store all fetched activities
  const [searchQuery, setSearchQuery] = useState(""); // Single search input
  const isGuest = localStorage.getItem("guest") === "true";
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [averageRating, setAverageRating] = useState(0); // Set default value to 0
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order

  const [displayFilter, setDisplayFilter] = useState(false);
  const [displaySort, setDisplaySort] = useState(false);

  const toggleFilter = () => {
    setDisplayFilter((prev) => !prev);
  };

  const toggleSort = () => {
    setDisplaySort((prev) => !prev);
  };


  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

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


  // Function to fetch activities based on search criteria
  const fetchSearchedActivities = () => {
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

  const fetchFilteredActivities = () => {
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

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  const fetchSortedActivities = () => {
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

  const fetchUpcomingActivities = async () => {
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
      <Container sx={{ width: '100%' }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography class="duckTitle">Activities</Typography> 
        </Box>


        <div
          style={{
            //div to surround search bar, button and the filter, and sort icons
            display: "grid",
            gridTemplateColumns: "2.5fr 0.5fr auto auto",
            gap: "16px", // Adjust the gap between items as needed
            paddingBottom: 24,
            width: '100%'
          }}
        >
         {/* SEARCH */}
          <Input
            variant="filled"
            placeholder="Search for an activity..."
            className="searchInput"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            sx={{ width: "100%" }}
          />
          <Button
            variant="solid"
            onClick={fetchSearchedActivities}
            sx={{ backgroundColor: "orange" }}
            className="blackhover"
          >
            Search
          </Button>

        <IconButton onClick={toggleFilter}>
          <FilterAltIcon sx={{ color: "black" }} />
        </IconButton>
        <IconButton onClick={toggleSort}>
          <SortIcon sx={{ color: "black" }} />
        </IconButton>
        </div>

        {/* FILTER */}
        {displayFilter && (
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px", // Adds space between the filter fields
          }}
        >
          <Input
            placeholder="Price"
            value={price}
            color="primary"
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            sx={{
              color: "orange",
              borderColor: "orange",
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#FEF4EA",
              },
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          />
          <Input
            placeholder="Date"
            type="date"
            variant="outlined"
            color="primary"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              color: "orange",
              borderColor: "orange",
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#FEF4EA",
              },
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              indicator={<KeyboardArrowDown />}
              color="primary"
              placeholder="Category"
              onChange={(e, newValue) => {
                setCategory(newValue);
              }}
              sx={{
                color: "orange",
                borderColor: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
                width: 240,
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            >
              <Option value="">
                <em>Any</em>
              </Option>
              {categories.map((cat) => (
                <Option key={cat._id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ minWidth: 150 }}>
            <Typography variant="body1">Rating: {averageRating}</Typography>
            <Slider
              value={averageRating}
              onChange={(e, newValue) => setAverageRating(newValue)}
              step={1}
              marks={[0, 1, 2, 3, 4, 5].map((value) => ({
                value,
                label: value,
              }))}
              min={0}
              max={5}
              valueLabelDisplay="auto"
              sx={{
                color: "orange",
                borderColor: "orange",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
                width: 240,
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            />
          </Box>

          <Button
            className="blackhover"
            onClick={fetchFilteredActivities}
          >
            Filter
          </Button>
        </Box>
        )}

        <Button
          className="blackhover"
          onClick={fetchUpcomingActivities}
          sx={{marginBottom:'3%'}}
        >
          Upcoming Activities Only
        </Button>

        {/* SORTING */}


        {displaySort && (
        <div
        style={{
          display: "flex",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        <FormControl>
          <Select
            indicator={<KeyboardArrowDown />}
            placeholder="Sort By"
            onChange={(e, newValue) => {
              setSortBy(newValue);
            }}
            sx={{
              color: "orange",
              borderColor: "orange",
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#FEF4EA",
              },
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="date"
            >
              Date
            </Option>
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="price"
            >
              Price
            </Option>
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="name"
            >
              Name
            </Option>
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="duration"
            >
              Duration
            </Option>
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="category"
            >
              Category
            </Option>
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="specialDiscount"
            >
              Discount
            </Option>
            <Option
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
              value="averageRating"
            >
              Rating
            </Option>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }}>
          <Select
            labelId="order-label"
            placeholder="Order"
            onChange={(e, value) => {
              setOrder(value);
            }}
            indicator={<KeyboardArrowDown />}
            sx={{
              "&.MuiSelect-MenuItem": {
                backgroundColor: "orange",
              },
              "&.Joy-JoySelectListBox": {
                sx: {
                  backgroundColor: "orange",
                },
              },

              color: "orange",
              borderColor: "orange",
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#FEF4EA",
              },
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
          >
            <Option
              value="asc"
              sx={{
                color: "orange",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              Ascending
            </Option>
            <Option
              value="desc"
              sx={{ color: "orange", backgroundColor: "#ffffff" }}
            >
              Descending
            </Option>
          </Select>
        </FormControl>

        <Button
          className="blackhover"
          sx={{ backgroundColor: "#ff9933", color: "white " }}
          onClick={fetchSortedActivities}
        >
          Sort
        </Button>
      </div>
      )}


{/* cards start here */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px", // Adjust the gap between items as needed
            width: "100%",
          }}
        >
          {Array.isArray(activities) && activities.length > 0 ? (
            activities.map((activity) =>
              activity.flag === false &&
              activity.advertiserDeleted === false &&
              activity.deletedActivity === false ? (
                <ActivityCard activity={activity} />
              ) : null
            )
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No activities available
            </Typography>
          )}
        </div>
      </Container>

      <Help />
    </Box>
  );
};

export default SearchActivities;
