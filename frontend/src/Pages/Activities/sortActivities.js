//This is the page that gets called when the sort activities button is clicked and it contains upcoming activities
import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import {
  Box,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Rating,
  IconButton,
} from "@mui/material";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import ActivityCard from "../../Components/activityCard";
import { useNavigate } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const SortActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [isSaved, setIsSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  // Function to fetch sorted activities
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

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Fetch activities on initial load
  useEffect(() => {
    // Fetch initial activities if needed
    fetchSortedActivities(); // Optional: Remove this line if you only want to load activities after clicking Sort
  }, []);

  return (
    <div className="yassin fouda" style={{ width: "100%", marginTop: 20 }}>
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


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px", // Adjust the gap between items as needed
          width: "100%",
        }}
      >
        {activities.map((activity) =>
          activity.flag === false &&
          activity.advertiserDeleted === false &&
          activity.deletedActivity === false
            ? (console.log("this is the average rating ", activity.ratings[1]),
              (<ActivityCard activity={activity} />))
            : null
        )}
      </div>

      {/* <TableCell>
                    <span
                      onClick={() =>
                        handleSaveActivity(
                          activity._id,
                          activity.saved?.isSaved
                        )
                      }
                    >
                      {saveStates[activity._id] ? (
                        <IconButton>
                          <BookmarkIcon />
                        </IconButton>
                      ) : (
                        <IconButton>
                          <BookmarkBorderIcon />
                        </IconButton>
                      )}
                    </span>  SAVED BY JAYDAA
                  </TableCell> */}
      <Help />
    </div>
  );
};

export default SortActivities;
