import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { message, Tag } from "antd";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TouristNavBar from "../../Components/TouristNavBar.js";
import StandAloneToggleButton from "../../Components/ToggleButton.js";
import TouristCategoryDropDown from "../../Components/TouristComponents/TouristCategoryDropDown.js";
import TagsToggleButtons from "../../Components/MuseumHistoricalPlaceComponent/TagsToggleButtons.js";

const EditProfile = () => {
  const [touristDetails, setTouristDetails] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    nationality: "",
    DOB: "",
    employmentStatus: "",
    wallet: 0,
    tagPreferences: [],
    favouriteCategory: localStorage.getItem("category"),
    historicalPlacestags: [],
  });
  let allTags = JSON.parse(localStorage.getItem("tags")) || [];
  let allHistoricalPlacesTags =
    JSON.parse(localStorage.getItem("MuseumTags")) || [];
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios
        .get(`http://localhost:8000/touristAccount/viewaccount/${userName}`)
        .then((response) => {
          message.success("Tourist details fetched successfully");
          const formattedDOB = response.data.DOB.split("T")[0];
          setTouristDetails({
            ...response.data,
            DOB: formattedDOB,
          });
          console.log("Tourist details fetched successfully:", touristDetails);
        })
        .catch((error) => {
          message.error("Error fetching tourist details");
          console.error("Error fetching tourist details:", error);
        });
    }
  }, []);

  function getTagNames(element) {
    return {
      _id: element._id,
      name: element.name,
    };
  }

  function getHistoricalPlaceTagNames(element) {
    return {
      _id: element._id,
      name: element.historicalPlaceTag,
    };
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/preferenceTags/")
      .then((response) => {
        const data = response.data;
        allTags = data.map(getTagNames);
        localStorage.setItem("tags", JSON.stringify(allTags));
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });

    axios
      .get(
        "http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags"
      )
      .then((response) => {
        const data = response.data;
        allHistoricalPlacesTags = data.map(getHistoricalPlaceTagNames);
        localStorage.setItem(
          "MuseumTags",
          JSON.stringify(allHistoricalPlacesTags)
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the Museum Tags!", error);
      });
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios
      .put("http://localhost:8000/touristAccount/editaccount", touristDetails)
      .then((response) => {
        message.success("Tourist details updated successfully");
        setIsEditing(false);
        console.log("editing", touristDetails);
      })
      .catch((error) => {
        message.error("Error updating tourist details");
        console.error("Error updating tourist details:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTouristDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    console.log("Category is ", localStorage.getItem("category"));
    setTouristDetails((prevDetails) => ({
      ...prevDetails,
      favouriteCategory: category,
    }));
  };

  const handleTagsChange = (tags) => {
    setTouristDetails((prevDetails) => ({
      ...prevDetails,
      tagPreferences: tags,
    }));
  };

  const handleHistoricalPlacesTagsChange = (tags) => {
    setTouristDetails((prevDetails) => ({
      ...prevDetails,
      historicalPlacestags: tags,
    }));
  };

  return (
    <>
      <TouristNavBar />
      <Box sx={{ p: 6 }}></Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ p: 3 }}>
          <Link to="/touristDashboard">Back to Dashboard</Link>
        </Box>
        <Box
          sx={{ flexGrow: 1, p: 4, display: "flex", justifyContent: "center" }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 5,
              width: "550px",
              borderRadius: 3,
              boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64 }}>
                <AccountCircleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Edit Tourist Profile
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                name="userName"
                value={touristDetails.userName}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={touristDetails.email}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={touristDetails.password}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={touristDetails.mobileNumber}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Nationality"
                name="nationality"
                value={touristDetails.nationality}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Date of Birth"
                name="DOB"
                type="date"
                value={touristDetails.DOB}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Employment Status"
                name="employmentStatus"
                value={touristDetails.employmentStatus}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Wallet"
                name="wallet"
                value={touristDetails.wallet}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              {isEditing && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Choose Favourite Category
                  </Typography>
                  <TouristCategoryDropDown
                    category={touristDetails.favouriteCategory}
                    disabled={!isEditing}
                    onChange={handleCategoryChange}
                  />

                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Choose Itineraries' Preference Tags
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {allTags.map((element, index) => {
                      return (
                        <Box
                          key={element._id}
                          sx={{ flex: "1 1 calc(25% - 16px)" }}
                        >
                          <StandAloneToggleButton
                            tags={touristDetails.tagPreferences}
                            name={element.name}
                            onChange={handleTagsChange}
                            disabled={!isEditing}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Choose Museum & Historical Places' Preference Tags
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {allHistoricalPlacesTags.map((element, index) => {
                      return (
                        <Box
                          key={element._id}
                          sx={{ flex: "1 1 calc(25% - 16px)" }}
                        >
                          <TagsToggleButtons
                            tags={touristDetails.historicalPlacestags}
                            name={element.name}
                            onChange={handleHistoricalPlacesTagsChange}
                            disabled={!isEditing}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}
              {isEditing ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveClick}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default EditProfile;
