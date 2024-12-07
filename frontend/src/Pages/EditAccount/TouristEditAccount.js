import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { message } from "antd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import TouristNavBar from "../../Components/TouristNavBar.js";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
// import ProfilePictureUpload from "../../Components/pp.js"; // Import ProfilePictureUpload component
import { Link, useNavigate } from "react-router-dom";
import StandAloneToggleButton from "../../Components/ToggleButton.js";
import TouristCategoryDropDown from "../../Components/TouristComponents/TouristCategoryDropDown.js";
import TagsToggleButtons from "../../Components/MuseumHistoricalPlaceComponent/TagsToggleButtons.js";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar.js";
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

  const [open, setOpen] = useState(false); // State for the dialog
  const [userName, setUserName] = useState("");
  const handleDeleteClick = () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    setUserName(user?.username || "");
    setOpen(true); // Open the confirmation dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDeleteAccount = async () => {
    if (userName) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/touristAccount/deleteMyTouristAccount/${userName}`
        );
        alert(response.data.message); // Show success message
        navigate("/login"); // Redirect to the login page
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
    handleClose(); // Close the dialog after deletion
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <TouristNavBar />

      <Box
        sx={{
          p: 4,
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            marginTop: "30px",
            p: 5,
            width: "700px",
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            height: "100%",
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
            <Button variant="outlined" onClick={handleRedeemClick} sx={{borderColor:'orange', color:'orange'}}>
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
                <Typography variant="h6" sx={{ mt: 2 , marginBottom: '3%'}}>
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
                className="blackhover"
                onClick={handleEditClick}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Edit Profile
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              fullWidth
              sx={{
                py: 1.5,
                marginTop: "3%",
              }}
            >
              Delete My Account
            </Button>
          </Box>
        </Paper>
      </Box>
      <Help />
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm" // Keeps the width manageable; adjust if needed
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2, // Rounded corners
            padding: 2, // Padding inside the dialog
            boxShadow: 3, // Subtle shadow for better aesthetics
            height: "300px", // Increased height for more space
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #e0e0e0", // Subtle separator
            paddingBottom: 2,
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            color: "text.secondary", // Theme-based secondary text color
            padding: "24px", // Spacing inside the content
            display: "flex",
            flexDirection: "column", // Align content vertically
            justifyContent: "center", // Center vertically
            height: "100%", // Utilize full height
          }}
        >
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            Are you sure you want to delete your account?
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "error.main", fontWeight: "bold" }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center", // Center buttons
            padding: "8px 24px", // Spacing around buttons
          }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: "bold",
              padding: "8px 16px", // Add padding for better appearance
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            sx={{
              color: "white",
              backgroundColor: "error.main",
              fontWeight: "bold",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditProfile;
