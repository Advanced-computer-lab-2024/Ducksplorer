// This is the page that gets called when the upcoming activities button is clicked
import React from "react";
import SortActivities from "./sortActivities";
import { Button } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import FilterActivities from "./filterActivities";
// import { Link } from "react-router-dom";
import Help from "../../Components/HelpIcon";
import TouristNavBar from "../../Components/TouristNavBar.js";
import { Box, Container, Grid, Typography } from "@mui/material";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";

function SortFilterActivity() {
  const [sort, setSort] = useState(true);
  const [filter, setFilter] = useState(false);
  const isGuest = localStorage.getItem("guest") === "true";

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#ffffff",
        width: "80vw",
        paddingTop: "2vh", // Adjust for navbar height
        display: "flex",
        justifyContent: "center",
      }}
    >
      <TouristNavBar />
      <TouristSidebar />
      <div style={{ width: "80%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="700">
            Upcoming Activities
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "20px", // Adds space between the buttons
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
        </Box>

        {sort && <SortActivities />}
        {filter && <FilterActivities />}
      </div>
      <Help />
    </Box>
  );
}

export default SortFilterActivity;
