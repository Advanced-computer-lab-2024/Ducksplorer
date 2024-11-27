import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import Iconify from "./TopNav/iconify.js";
import axios from "axios";
import { message } from "antd";
import { useTypeContext } from "../context/TypeContext";
import DropDown from "./DropDown.js";
import {
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";

const FormSection = () => {
  const { type } = useTypeContext();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  // Additional state variables for conditional fields
  const [mobileNumber, setMobileNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [DOB, setDOB] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nationalIdFiles, setNationalIdFiles] = useState(null);
  const [certificatesFiles, setCertificatesFiles] = useState(null);
  const [uploadsFiles, setUploadsFiles] = useState(null);
  // const [acceptTerms, setAcceptTerms] = useState(false);
  // const [openTerms, setOpenTerms] = useState(false);
  const navigate = useNavigate();

  // Prevent scrolling and white border
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden"; // Disable scrolling
    document.body.style.height = "100%"; // Ensure full height
    document.body.style.width = "100%";

    return () => {
      // Reset styles when the component is unmounted
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handler for nationalId file selection
  const handleNationalIdSelect = (files) => {
    setNationalIdFiles(files);
  };
  const handleUploadsSelect = (files) => {
    setUploadsFiles(files);
  };
  // Handler for certificates file selection
  const handleCertificatesSelect = (files) => {
    setCertificatesFiles(files);
  };

  const validateFields = () => {
    if (!userName || !password || !confirmPassword || !email) {
      message.error("All fields are required");
      return false;
    }
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return false;
    }
    if (
      type === "Tourist" &&
      (!mobileNumber || !nationality || !DOB || !employmentStatus)
    ) {
      message.error("All fields are required for Tourist");
      return false;
    }
    if (
      type === "Guide" &&
      (!mobileNumber || !yearsOfExperience || !previousWork)
    ) {
      message.error("All fields are required for Guide");
      return false;
    }
    if (
      type === "Advertiser" &&
      (!websiteLink || !hotline || !companyProfile)
    ) {
      message.error("All fields are required for Advertiser");
      return false;
    }
    if (type === "Seller" && (!name || !description)) {
      message.error("All fields are required for Seller");
      return false;
    }
    if (!acceptTerms && type !== "Tourist") {
      message.error("You must Accept Terms & Conditions");
      return false;
    }

    return true;
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  const uploadDocument2 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("gowa upload doc2", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.url);
      console.log("Document uploaded successfully:", response.data);
      return response.data.url; // Return the file URL
    } catch (error) {
      console.log("fel catch", error.response);
      console.error("Error uploading document for tourguide:", error);
      return null; // Return null if upload fails
    }
  };

  const handleNationalIdFileSelect = (files) => {
    // Call the existing handler to process the selected national ID files
    handleNationalIdSelect(files);

    // Also update the selected files state
    setSelectedFiles(files);
  };
  const handleUploadsFileSelect = (files) => {
    // Call the existing handler to process the selected national ID files
    handleUploadsSelect(files);

    // Also update the selected files state
    setSelectedFiles(files);
  };
  const handleCertificatesFileSelect = (files) => {
    // Call the existing handler to process the selected national ID files
    handleCertificatesSelect(files);

    // Also update the selected files state
    setSelectedFiles2(files);
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }
    let nationalIdUrl = null; // Initialize variables to store URLs
    let certificatesUrl = null;
    let data = null;
    try {
      if (type === "Guide") {
        console.log("before error");
        const nationalIdFile =
          document.getElementById("nationalIdUpload").files[0];
        console.log(nationalIdFile);
        const certificatesFile =
          document.getElementById("certificateUpload").files[0];
        console.log(certificatesFile);
        // Upload documents and set URLs

        if (nationalIdFile) {
          nationalIdUrl = await uploadDocument2(nationalIdFile);
          console.log("nationalIdUrl gowa el if", nationalIdUrl);
        }
        if (certificatesFile) {
          certificatesUrl = await uploadDocument2(certificatesFile);
        }

        data = {
          userName,
          password,
          email,
          role: type,
          ...(type === "Tourist" && {
            mobileNumber,
            nationality,
            DOB,
            employmentStatus,
          }),
          ...(type === "Guide" && {
            mobileNumber,
            yearsOfExperience,
            previousWork,
            nationalIdUrl,
            certificatesUrl,
          }),
          ...(type === "Advertiser" && {
            websiteLink,
            hotline,
            companyProfile,
          }),
          ...(type === "Seller" && { name, description }),
        };
        try {
          console.log(data);
          await axios.post("http://localhost:8000/signUp", data);
          message.success("Signed Up successfully!");
        } catch (error) {
          message.error("An error occurred: " + error.message);
          console.error("There was an error signing up:", error);
        }
        if (selectedFiles.length > 0) {
          const fileUploadData = new FormData();
          fileUploadData.append("userName", userName);
          selectedFiles.forEach((file) => fileUploadData.append("files", file)); // Append each file object directly
          // Log each file appended for document upload
          for (let pair of fileUploadData.entries()) {
            console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
          }

          try {
            await axios.post(
              "http://localhost:8000/file/user/upload/documents",
              fileUploadData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            message.success("Documents uploaded successfully!");
          } catch (error) {
            console.error("Error uploading documents:", error);
            message.error(
              "Document upload failed: " +
                (error.response?.data?.message || error.message)
            );
          }
        }
        if (selectedFiles2.length > 0) {
          const fileUploadData = new FormData();
          fileUploadData.append("userName", userName);
          selectedFiles2.forEach((file) =>
            fileUploadData.append("files", file)
          ); // Append each file object directly

          try {
            await axios.post(
              "http://localhost:8000/file/user/upload/documents",
              fileUploadData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            message.success("Documents uploaded successfully!");
          } catch (error) {
            console.error("Error uploading documents:", error);
            message.error(
              "Document upload failed: " +
                (error.response?.data?.message || error.message)
            );
          }
        }
      } else {
        let uploadsFile = null;
        let uploads = null;
        if (!(type === "Tourist")) {
          uploadsFile = document.getElementById("uploads").files[0];
          console.log("gowa el if", uploadsFile);
          if (uploadsFile) {
            uploads = await uploadDocument2(uploadsFile);
          }
        }
        data = {
          userName,
          password,
          email,
          role: type,
          ...(type === "Tourist" && {
            mobileNumber,
            nationality,
            DOB,
            employmentStatus,
          }),
          ...(type === "Advertiser" && {
            websiteLink,
            hotline,
            companyProfile,
            uploads,
          }),
          ...(type === "Seller" && { name, description, uploads }),
        };
        try {
          console.log(data);
          await axios.post("http://localhost:8000/signUp", data);
          message.success("Signed Up successfully!");
        } catch (error) {
          message.error("An error occurred: " + error.message);
          console.error("There was an sigining up!", error);
        }
        if (selectedFiles.length > 0) {
          const fileUploadData = new FormData();
          fileUploadData.append("userName", userName);
          selectedFiles.forEach((file) => fileUploadData.append("files", file)); // Append each file object directly
          // Log each file appended for document upload
          for (let pair of fileUploadData.entries()) {
            console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
          }

          try {
            await axios.post(
              "http://localhost:8000/file/user/upload/documents",
              fileUploadData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            message.success("Documents uploaded successfully!");
          } catch (error) {
            console.error("Error uploading documents:", error);
            message.error(
              "Document upload failed: " +
                (error.response?.data?.message || error.message)
            );
          }
        }
      }
      window.location.href = "/login";
    } catch (error) {
      message.error("An error occurred: " + error.message);
      console.error("There was an error uploading document barra!", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the homepage
  };

    return (
      <div style={styles.container}>
        <div style={styles.overlay}></div>
        <Box style={styles.content}>
          <Typography variant="h4" style={styles.title}>
            Ducksplorer Sign Up Form
          </Typography>
          <Stack spacing={2} mt={3} style={styles.form}>
            <TextField
              name="username"
              label="Username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Iconify icon={showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {type === "Tourist" && (
              <>
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  fullWidth
                />
                <TextField
                  name="nationality"
                  label="Nationality"
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  fullWidth
                />
                <TextField
                  name="DOB"
                  label="Date of Birth"
                  type="date"
                  value={DOB}
                  onChange={(e) => setDOB(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  name="employmentStatus"
                  label="Employment Status"
                  type="text"
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {type === "Guide" && (
              <>
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  fullWidth
                />
                <label>National Id:</label>
                <FileUpload
                  inputId="nationalIdUpload"
                  onFileSelect={(files) => handleNationalIdFileSelect(files)}
                />
                <label>Certificates</label>
                <FileUpload
                  inputId="certificateUpload"
                  onFileSelect={(files) => handleNationalIdFileSelect(files)}
                />
                <TextField
                  name="yearsOfExperience"
                  label="Years of Experience"
                  type="text"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  fullWidth
                />
                <TextField
                  name="previousWork"
                  label="Previous Work"
                  type="text"
                  value={previousWork}
                  onChange={(e) => setPreviousWork(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {type === "Advertiser" && (
              <>
                <TextField
                  name="websiteLink"
                  label="Website Link"
                  type="text"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  fullWidth
                />
                <TextField
                  name="hotline"
                  label="Hotline"
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  fullWidth
                />
                <label>Uploads:</label>
                <FileUpload
                  inputId="uploads"
                  onFileSelect={(files) => handleNationalIdFileSelect(files)}
                />
                <TextField
                  name="companyProfile"
                  label="Company Profile"
                  type="text"
                  value={companyProfile}
                  onChange={(e) => setCompanyProfile(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {type === "Seller" && (
              <>
                <TextField
                  name="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <label>Uploads:</label>
                <FileUpload
                  inputId="uploads"
                  onFileSelect={(files) => handleNationalIdFileSelect(files)}
                />
                <TextField
                  name="description"
                  label="Description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                />
              </>
            )}
            <DropDown />
            {type && (type === "Seller" || type === "Advertiser" || type === "Guide" || type === "Tourist") && (
              <FormControlLabel
                sx={{ justifyContent: "center" }}
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <span>
                    I accept the{" "}
                    <a
                      href="#"
                      onClick={handleOpenTerms}
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      Terms & Conditions
                    </a>
                  </span>
                }
              />
            )}
            <Dialog open={openTerms} onClose={handleCloseTerms}>
              <DialogTitle>Terms and Conditions</DialogTitle>
              <DialogContent>
                <Typography variant="h6" gutterBottom>
                  1. Acceptance of Terms
                </Typography>
                <Typography paragraph>
                  By using our Site, you affirm that you are at least 18 years old
                  and capable of entering into a legally binding agreement. If you
                  are using the Site on behalf of a company or other legal entity,
                  you represent that you have the authority to bind that entity to
                  these Terms.
                </Typography>
  
                <Typography variant="h6" gutterBottom>
                  2. Changes to Terms
                </Typography>
                <Typography paragraph>
                  We reserve the right to modify or replace these Terms at any time.
                  If we make material changes, we will provide notice on our Site.
                  Your continued use of the Site after any such changes constitutes
                  your acceptance of the new Terms.
                </Typography>
  
                <Typography variant="h6" gutterBottom>
                  3. Services Offered
                </Typography>
                <Typography paragraph>
                  Ducksplorer provides trip planning services, including but not
                  limited to travel itineraries, booking information, and
                  destination recommendations. We do not act as a travel agent, and
                  we do not provide travel services directly.
                </Typography>
  
                <Typography variant="h6" gutterBottom>
                  4. User Responsibilities
                </Typography>
                <Typography paragraph>
                  When using our Site, you agree to:
                </Typography>
                <ul>
                  <li>
                    <Typography>
                      Provide accurate and complete information when creating an
                      account or making bookings.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Maintain the confidentiality of your account and password.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Notify us immediately of any unauthorized use of your account.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Use the Site only for lawful purposes and in accordance with
                      these Terms.
                    </Typography>
                  </li>
                </ul>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseTerms} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              variant="contained"
              onClick={handleAdd}
              style={styles.button}
            >
              Sign Up
            </Button>
            <Typography variant="body2" style={styles.linkText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </Typography>
            {/* Back to Homepage Button */}
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              style={styles.backButton}
              onClick={handleBackToHome}
            >
              Back to Homepage
            </Button>
          </Stack>
        </Box>
      </div>
    );
  };
  
  const styles = {
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "url('/travelbg.jpg') no-repeat center center fixed",
      backgroundSize: "cover",
      overflow: "hidden", // Prevent scrolling on the main page
      display: "flex",
      justifyContent: "center", // Center the form horizontally
      alignItems: "center", // Center the form vertically
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    },
    content: {
      position: "relative",
      zIndex: 2,
      background: "rgba(255, 255, 255, 0.9)",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      width: "100%",
      maxWidth: "500px", // Widen the container
      margin: "auto",
      marginTop: "10vh", // Adjusted to fit everything on the page
      textAlign: "center",
      overflowY: "auto", // Allow scrolling within the form
      maxHeight: "80vh", // Limit the height of the form container
    },
    title: {
      color: "#ff8c00",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#555",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#ff8c00",
      color: "#fff",
      marginTop: "20px",
    },
    linkText: {
      marginTop: "10px",
      color: "#555",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
      fontWeight: "bold",
    },
    backButton: {
      marginTop: "15px",
      backgroundColor: "#fff",
      color: "#007bff",
    },
  };
  
export default FormSection;