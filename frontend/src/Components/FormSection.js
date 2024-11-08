import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Stack,
  Typography,
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
import { Link } from "react-router-dom";

const FormSection = () => {
  const { type } = useTypeContext();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

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
    if (!acceptTerms) {
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

  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }
    const data = {
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
      }),
      ...(type === "Advertiser" && { websiteLink, hotline, companyProfile }),
      ...(type === "Seller" && { name, description }),
    };

    try {
      await axios.post("http://localhost:8000/signUp", data);
      message.success("Signed Up successfully!");
      window.location.href = "/login";
    } catch (error) {
      message.error("An error occurred: " + error.message);
      console.error("There was an error signing up!", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(airplaneBG.jpg)", // Update with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "140vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    
      <Stack
        spacing={1}
        sx={{
          width: "600px",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          //backgroundSize: "cover",
          borderRadius: "10px",
        }}
      >
         <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }} 
      >
        <img
          src="logo3.png" // Update with your image path
          alt="logo"
          style={{ width: "200px", height: "200px" }}
        />
        <h1 style={{ color: "Black", fontSize: "40px" }}>Ducksplorer Sign Up form</h1>
      </div>
        <TextField
          name="username"
          label="Username"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"} // Toggle password visibility
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
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
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"} // Toggle password visibility
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={
                      showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                    }
                    style={{ color: "#602b37", fontSize: "40px" }}
                  />
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
            />
            <TextField
              name="nationality"
              label="Nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
            <TextField
              name="DOB"
              label="Date of Birth"
              type="date"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="employmentStatus"
              label="Employment Status"
              type="text"
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
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
            />
            <TextField
              name="yearsOfExperience"
              label="Years of Experience"
              type="text"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
            <TextField
              name="previousWork"
              label="Previous Work"
              type="text"
              value={previousWork}
              onChange={(e) => setPreviousWork(e.target.value)}
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
            />
            <TextField
              name="hotline"
              label="Hotline"
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
            />
            <TextField
              name="companyProfile"
              label="Company Profile"
              type="text"
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
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
            />
            <TextField
              name="description"
              label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}
        <DropDown />
        <FormControlLabel sx={{  justifyContent: "center" }}
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
          style={{
            width: "580px",
            backgroundColor: "Green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            padding: "10px",
            justifyContent: "center",
          }}
        >
          Sign Up
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <p style={{ marginRight: "10px" }}>Already have an account? </p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <p style={{ color: "blue", cursor: "pointer" , textDecoration: "underline"}}>Login</p>
          </Link>
        </div>
      </Stack>
    </div>
  );
};

export default FormSection;
