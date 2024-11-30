// This is the page that gets called when the upcoming activities button is clicked
import React from "react";
import SortActivities from "./sortActivities";
import { Button } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import FilterActivities from "./filterActivities";
// import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar.js";
import { Box } from "@mui/material";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";

function SortFilterActivity() {
  const [sort, setSort] = useState(true);
  const [filter, setFilter] = useState(false);
  const isGuest = localStorage.getItem("guest") === "true";

  return (
    <div className="SortFilterDiv" style={{ height: "100vh" }}>
      <TouristNavBar />
      <TouristSidebar />
      {/* Back to Dashboard Button */}
      <Button
        component={Link}
        to={isGuest ? "/guestDashboard" : "/touristDashboard"}
        variant="contained"
        sx={{
          backgroundColor: "#1a237e",
          color: "white",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        Back to Dashboard
      </Button>

      {/* Sorting and Filtering Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "20px", // Adds space between the buttons
          marginBottom: "20px", // Spacing below the buttons
        }}
      >
        <Button
          variant="outlined"
          sx={{
            border: "2px solid black",
            borderRadius: "50px",
            color: "black",
            padding: "10px 20px",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={() => {
            setSort(!sort);
            if (filter) {
              setFilter(false);
            }
          }}
        >
          Sort
        </Button>

        <Button
          variant="outlined"
          sx={{
            border: "2px solid black",
            borderRadius: "50px",
            color: "black",
            padding: "10px 20px",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={() => {
            setFilter(!filter);
            if (sort) {
              setSort(false);
            }
          }}
        >
          Filter
        </Button>
      </div>

      {/* Sort and Filter Components */}

      {sort && <SortActivities />}
      {filter && <FilterActivities />}

      {/* Help Icon */}
      <Help />
    </div>
  );
}

export default SortFilterActivity;
