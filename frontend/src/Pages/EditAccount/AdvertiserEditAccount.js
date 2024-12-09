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
import { Link, useNavigate } from "react-router-dom";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FileUpload from "../../Components/FileUpload";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
// import ProfilePictureUpload from "../../Components/pp";
import DownloadButton from "../../Components/DownloadButton";
import AdvertiserNavBar from "../../Components/NavBars/AdvertiserNavBar.js";
import Help from "../../Components/HelpIcon.js";


const AdvertiserEditProfile = () => {
  const [advertiserDetails, setAdvertiserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    websiteLink: "",
    hotline: "",
    companyProfile: "",
    uploads: "",
    photo: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [open, setOpen] = useState(false); // State for the dialog


  const handlePhotoUpload = async () => {
    const photoFile = document.getElementById("photo").files[0];
    const formData = new FormData();
    formData.append("file", photoFile);

    try {
      message.success("Uploading photo...");
      const response = await axios.post(
        "http://localhost:8000/api/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAdvertiserDetails((prevDetails) => ({
        ...prevDetails,
        photo: response.data.url,
      }));
      message.success("Photo uploaded successfully");
    } catch (error) {
      message.error("Error uploading photo");
    }
  };

  const handlePhotoDelete = () => {
    try {
      setAdvertiserDetails((prevDetails) => ({ ...prevDetails, photo: "" }));
      message.success("Photo deleted successfully");
    } catch (error) {
      message.error("Error deleting photo");
    }
  };

  const handleUploadsSelect = async () => {
    const uploadsFile = document.getElementById("uploads").files[0];
    console.log("before the call", uploadsFile);
    advertiserDetails.uploads = await handleFileUpload(uploadsFile);
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      axios
        .get(`http://localhost:8000/advertiserAccount/viewaccount/${userName}`)
        .then((response) => {
          setAdvertiserDetails({ ...response.data });
        })
        .catch((error) => {
          message.error("Error fetching advertiser details");
          console.error("Error fetching advertiser details:", error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileUpload = async (uploads) => {
    const formData = new FormData();
    formData.append("file", uploads);
    try {
      message.success("uploading file please wait");
      const response = await axios.post(
        "http://localhost:8000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("File uploaded successfully, you can now click save");
      console.log(response.data.url);
      console.log("Document uploaded successfully:", response.data);
      return response.data.url; // Return the file URL
    } catch (error) {
      message.error("Error uploading document");
      console.log("fel catch", error.response.data);
      console.error("Error uploading document for tourguide:", error);
      return null; // Return null if upload fails
    }
  };
  const handleSaveClick = () => {
    axios
      .put(
        "http://localhost:8000/advertiserAccount/editaccount",
        advertiserDetails
      )
      .then(() => {
        message.success("Advertiser details updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        message.error("Error updating advertiser details");
        console.error("Error updating advertiser details:", error);
      });
  };


  const handleDeleteClick = () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    setOpen(true); // Open the confirmation dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAdvertiserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleFileDelete = async (uploads) => {
    const userName = advertiserDetails.userName; // assuming userName is stored in AdvertiserDetails

    if (!userName) {
      message.error("Username is missing");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/advertiserAccount/removeFileUrl`,
        {
          userName: userName,
          uploads: uploads, // using "uploads" to match the backend parameter
        }
      );
      message.success("File deleted successfully");

      // Remove the file URL from the state
      setAdvertiserDetails((prevDetails) => ({
        ...prevDetails,
        [uploads]: "", // clears the correct field in the state
      }));
    } catch (error) {
      message.error("Error deleting file");
      console.error("Error deleting file:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (userName) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/advertiserAccount/deleteMyAdvertiserAccount/${userName}`
        );
        alert(response.data.message);
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
        }}
      >
        <AdvertiserNavBar />
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
              width: "60vw",
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
              <Avatar
                src={advertiserDetails.photo}
                sx={{ width: 64, height: 64 }}
              />
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="photo"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="photo">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{
                        color: "#ff9933",
                        borderColor: "#ff9933",
                        marginBottom: 2,
                        marginTop: 2,
                      }}
                    >
                      Upload New Photo
                    </Button>
                  </label>
                  {advertiserDetails.photo && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handlePhotoDelete()}
                    >
                      Delete Photo
                    </Button>
                  )}
                </>
              )}
              <h2 className="bigTitle"
                style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}> Edit Profile</h2>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                name="userName"
                value={advertiserDetails.userName}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={advertiserDetails.email}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={advertiserDetails.password}
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
                          icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                          style={{ color: "#602b37", fontSize: "40px" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Website Link"
                name="websiteLink"
                value={advertiserDetails.websiteLink}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Hotline"
                name="hotline"
                value={advertiserDetails.hotline}
                type="number"
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Company Profile"
                name="companyProfile"
                value={advertiserDetails.companyProfile}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
              <Box disabled={!isEditing} sx={{ display: "flex", gap: 2, mt: 3 }}>
                <label>Uploads:</label>
                <DownloadButton
                  fileUrl={advertiserDetails.uploads}
                  label="Download uploaded file"
                />
                {isEditing && (
                  <>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleFileDelete("uploads")}
                    >
                      Delete uploaded file
                    </Button>
                    <FileUpload
                      inputId="uploads"
                      onFileSelect={handleUploadsSelect}
                    />
                  </>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              {isEditing ? (
                <Button
                  className="blackhover"
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
                  className="blackhover"
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
    </>
  );
};

export default AdvertiserEditProfile;
