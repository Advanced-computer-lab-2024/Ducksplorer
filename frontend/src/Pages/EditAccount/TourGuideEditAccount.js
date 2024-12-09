import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { message, Tour } from "antd";
import FileUpload from "../../Components/FileUpload";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
import DownloadButton from "../../Components/DownloadButton";
import TourGuideNavBar from "../../Components/NavBars/TourGuideNavBar";
import { Link, useNavigate } from "react-router-dom";
import Help from "../../Components/HelpIcon.js";

const TourGuideEditProfile = () => {
  const [tourGuideDetails, setTourGuideDetails] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    yearsOfExperience: "",
    previousWork: "",
    nationalId: "",
    certificates: "",
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
      setTourGuideDetails((prevDetails) => ({
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
      setTourGuideDetails((prevDetails) => ({ ...prevDetails, photo: "" }));
      message.success("Photo deleted successfully");
    } catch (error) {
      message.error("Error deleting photo");
    }
  };

  const handleNationalIdSelect = async () => {
    const nationalIdFile = document.getElementById("nationalIdUpload").files[0];
    tourGuideDetails.nationalId = await handleFileUpload(nationalIdFile);
  };

  const handleCertificatesSelect = async () => {
    const certificatesFile =
      document.getElementById("certificateUpload").files[0];
    console.log("before the call", certificatesFile);
    tourGuideDetails.certificates = await handleFileUpload(certificatesFile);
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    if (userName) {
      try {
        axios
          .get(`http://localhost:8000/tourGuideAccount/viewaccount/${userName}`)
          .then((response) => {
            message.success("Tour Guide details fetched successfully");
            setTourGuideDetails({ ...response.data });
          });
        // console.log('National ID URL:', tourGuideDetails.nationalIdUrl);
        // console.log('Certificates URL:', tourGuideDetails.certificatesUrl);
      } catch (error) {
        message.error("Error fetching tour guide details");
        console.error("Error fetching tour guide details:", error);
      }
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTourGuideDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("gowa upload doc2", formData);
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
      message.success("File uploaded successfully");
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

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };


  const handleSaveClick = () => {
    axios
      .put(
        "http://localhost:8000/tourGuideAccount/editaccount",
        tourGuideDetails
      )
      .then((response) => {
        message.success("Tour Guide details updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        message.error("Error updating tour guide details");
        console.error("Error updating tour guide details:", error);
      });
  };
  // File delete handler
  const handleFileDelete = async (fileType) => {
    const userName = tourGuideDetails.userName; // assuming userName is stored in tourGuideDetails

    if (!userName) {
      message.error("Username is missing");
      return;
    }

    try {
      await axios.post(`http://localhost:8000/tourGuideAccount/removeFileUrl`, {
        userName: userName,
        fileType: fileType,
      });
      message.success("File deleted successfully");

      // Remove the file URL from the state
      setTourGuideDetails((prevDetails) => ({
        ...prevDetails,
        [fileType]: "",
      }));
    } catch (error) {
      message.error("Error deleting file");
      console.error("Error deleting file:", error);
    }
  };

  const handleDeleteClick = () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    setOpen(true); // Open the confirmation dialog
  };

  const handleDeleteAccount = async () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (userName) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/tourGuideAccount/deleteMyTourGuideAccount/${userName}`
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
    <Box sx={{ height: "100vh" }}>
      <TourGuideNavBar />
      <Box sx={{ p: 4, justifyContent: "center" }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "60vw",
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            height: "100%",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={tourGuideDetails.photo}
                sx={{ width: 80, height: 80 }}
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
                  {tourGuideDetails.photo && (
                    <Button
                      onClick={handlePhotoDelete}
                      variant="outlined"
                      color="error"
                    >
                      Delete Photo
                    </Button>
                  )}

                </>
              )}
            </Box>

            <h2 className="bigTitle"
              style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}> Edit Profile</h2>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Username"
              name="userName"
              value={tourGuideDetails.userName}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={tourGuideDetails.email}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={tourGuideDetails.password}
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
              value={tourGuideDetails.mobileNumber}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Years of Experience"
              name="yearsOfExperience"
              value={tourGuideDetails.yearsOfExperience}
              type="number"
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Previous Work"
              name="previousWork"
              value={tourGuideDetails.previousWork}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
            />
            <Box disabled={!isEditing} sx={{ display: "flex", gap: 2, mt: 3 }}>
              <label>National ID</label>
              <DownloadButton
                fileUrl={tourGuideDetails.nationalId}
                label="Download National ID"
              />
              {isEditing && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleFileDelete("nationalId")}>
                    Delete National ID
                  </Button>
                  <FileUpload
                    inputId="nationalIdUpload"
                    onFileSelect={handleNationalIdSelect}
                  />
                </>
              )}
            </Box>

            <Box disabled={!isEditing} sx={{ display: "flex", gap: 2, mt: 3 }}>
              <label>Certificates</label>
              <DownloadButton
                fileUrl={tourGuideDetails.certificates}
                label="Download Certificates"
              />
              {isEditing && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleFileDelete("certificates")}>
                    Delete Certificates
                  </Button>
                  <FileUpload
                    inputId="certificateUpload"
                    onFileSelect={handleCertificatesSelect}
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

          <Box sx={{ textAlign: "center", mt: 2 }}></Box>
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

export default TourGuideEditProfile;