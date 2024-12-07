import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Box, Typography, FormControl, Button } from "@mui/material";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import ActivityCard from "../../Components/activityCard";
import Help from "../../Components/HelpIcon";

const SortActivities = () => {
  const [activities, setActivities] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [order, setOrder] = useState("asc"); // Default ascending order
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [isSaved, setIsSaved] = useState(false);

  // Function to fetch sorted activities
  const fetchSortedActivities = () => {
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    axios
      .get(
        `http://localhost:8000/activity/sort?sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        let Activities = response.data;
        if (showPreferences === "true") {
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
        }
        Activities = Activities.map((activity) => ({
          ...activity,
          saved: activity.saved || { isSaved: false, user: null },
        }));
        setActivities(Activities);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  };

  // Call the fetch function whenever `sortBy` or `order` changes
  useEffect(() => {
    fetchSortedActivities();
  }, [sortBy, order]); // This triggers the fetch whenever either value changes

  return (
    <div className="yassin fouda" style={{ width: "100%", marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        {/* Sort By Select */}
        <FormControl>
          <Select
            indicator={<KeyboardArrowDown />}
            placeholder="Sort By"
            value={sortBy}
            onChange={(e, newValue) => setSortBy(newValue)}
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
            <Option value="date">Date</Option>
            <Option value="price">Price</Option>
            <Option value="name">Name</Option>
            <Option value="duration">Duration</Option>
            <Option value="category">Category</Option>
            <Option value="specialDiscount">Discount</Option>
            <Option value="averageRating">Rating</Option>
          </Select>
        </FormControl>

        {/* Order Select */}
        <FormControl>
          <Select
            labelId="order-label"
            placeholder="Order"
            value={order}
            onChange={(e, newValue) => setOrder(newValue)}
            indicator={<KeyboardArrowDown />}
            sx={{
              color: "orange",
              borderColor: "orange",
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#FEF4EA",
              },
              width: 240,
            }}
          >
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </Select>
        </FormControl>
      </div>

      {/* Activity Cards Grid */}
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
          activity.deletedActivity === false ? (
            <ActivityCard key={activity._id} activity={activity} />
          ) : null
        )}
      </div>

      <Help />
    </div>
  );
};

export default SortActivities;
