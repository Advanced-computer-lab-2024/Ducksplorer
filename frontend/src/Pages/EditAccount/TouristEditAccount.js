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
import { message } from "antd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import ProfilePictureUpload from "../../Components/pp.js"; // Import ProfilePictureUpload component
import { Link } from "react-router-dom";
import StandAloneToggleButton from "../../Components/ToggleButton.js";
import TouristCategoryDropDown from "../../Components/TouristComponents/TouristCategoryDropDown.js";
import TagsToggleButtons from "../../Components/MuseumHistoricalPlaceComponent/TagsToggleButtons.js";
import Help from "../../Components/HelpIcon.js";

const EditProfile = () => {
  const [touristDetails, setTouristDetails] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    nationality: "",
    DOB: "",
    employmentStatus: "",
    wallet: 0,
    points: 0,
    tagPreferences: [],
    favouriteCategory: localStorage.getItem("category"),
    historicalPlacestags: [],
  });
  let allTags = JSON.parse(localStorage.getItem("tags")) || [];
  let allHistoricalPlacesTags =
    JSON.parse(localStorage.getItem("MuseumTags")) || [];
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

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

  const handleEditClick = async () => setIsEditing(true);
  const handleRedeemClick = () => {
    const redeemPoints = async () => {
      try {
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;

        const response = await axios.patch(
          `http://localhost:8000/touristRoutes/redeemPoints/${userName}?addPoints=10000`
        );
        console.log("Redeem successful:", response.data);
        // Display success message or update wallet UI based on response
        if (response.data) {
          message.success("Redeem successful!");
          // Update the tourist details with new wallet and points values
          // setTouristDetails(prevDetails => ({
          //   ...prevDetails,
          //   wallet: response.data.updatedWallet,  // Assuming backend sends updated wallet balance
          //   points: response.data.updatedPoints   // Assuming backend sends updated points
          // }));
          axios
            .get(`http://localhost:8000/touristAccount/viewaccount/${userName}`)
            .then((response) => {
              message.success("Tourist details updated successfully");
              const formattedDOB = response.data.DOB.split("T")[0];
              setTouristDetails({
                ...response.data,
                DOB: formattedDOB,
              });
            })
            .catch((error) => {
              message.error("Error fetching tourist details");
              console.error("Error fetching tourist details:", error);
            });
        }
      } catch (error) {
        message.error("No enought points to redeem !");
        console.error(
          "Error redeeming points:",
          error.response?.data?.error || error.message
        );
      }
    };
    redeemPoints();
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
    <Box
      sx={{
        display: "flex",
        overflowY : 'visible',
        height: "100vh",
      }}
    >
      <TouristNavBar />
      <Box sx={{ height: "100vh", p: 3 }}>
        <Link to="/touristDashboard">Back to Dashboard</Link>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          overflowY : 'visible'
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            width: "550px",
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            height: "120vh",
            overflow: "visible",
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
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={touristDetails.password}
              height="50"
              width="20"
              onChange={handleChange}
              InputProps={{
                readOnly: !isEditing,

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                        style={{ color: "#602b37", fontSize: "40px" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
            <TextField
              label="Points"
              name="points"
              value={touristDetails.points}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button variant="outlined" onClick={handleRedeemClick}>
              Redeem points
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              flexDirection: "column",
            }}
          >
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
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {allTags.map((element, index) => {
                    return (
                      <Box
                        key={element._id}
                        sx={{ display: "flex", flexWrap: "wrap" }}
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
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  {allHistoricalPlacesTags.map((element, index) => {
                    return (
                      <Box
                        key={element._id}
                        sx={{ display: "flex", flexWrap: "wrap" }}
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
      <Help />
    </Box>
  );
};

export default EditProfile;
