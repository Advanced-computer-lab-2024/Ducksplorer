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
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <TouristNavBar />
      <TouristSidebar/>

      <div
        style={{
          padding: "300px",
          backgroundColor: "#f9f9f9", // Light background for better contrast
          backgroundImage: "url('/travelbg.jpg')", // Path to your background image
          borderRadius: "12px", // Rounded corners for the container
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          maxWidth: "1200px",
          margin: "20px auto", // Centers the container and adds spacing from the top
          marginTop: "15%",
        }}
      >
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
            padding: "10px 20px",
            marginBottom: "20px",
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
        <div
          style={{
            padding: "20px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#ffffff", // White background for the components
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          {sort && <SortActivities />}
          {filter && <FilterActivities />}
        </div>

        {/* Help Icon */}
        <Help />
      </div>
    </Box>
  );
}

export default SortFilterActivity;
