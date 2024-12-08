import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Container,
  Grid,
  Box,
  Typography
} from "@mui/material";
import axios from "axios";
import { message } from "antd";
import CategoriesDropDown from "./CategoryDropDown";
import StandAloneToggleButton from "./ToggleButton";
import AdvertiserSidebar from "./Sidebars/AdvertiserSidebar";
import { useNavigate } from "react-router-dom";
import AdvertiserNavBar from "./NavBars/AdvertiserNavBar";

let tags = [];

const AddActivityForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(""); // Location state
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [specialDiscount, setSpecialDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const allTags = JSON.parse(localStorage.getItem("tags")) || [];
  const navigate = useNavigate();

  // Fetch location and form data from localStorage after navigating back
  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation");
    if (storedLocation) {
      setLocation(storedLocation); // Update location state
    }

    // Retrieve form data from localStorage
    const storedFormData = localStorage.getItem("addActivityFormData");
    if (storedFormData) {
      const {
        name: storedName,
        date: storedDate,
        isOpen: storedIsOpen,
        price: storedPrice,
        specialDiscount: storedDiscount,
        duration: storedDuration,
        tags: storedTags,
      } = JSON.parse(storedFormData);

      setName(storedName || "");
      setDate(storedDate || "");
      setIsOpen(storedIsOpen || false);
      setPrice(storedPrice || "");
      // setCategory(localStorage.getItem("category") ? localStorage.getItem("category").trim() : "");
      setCategory(localStorage.getItem("category") || "");
      setSpecialDiscount(storedDiscount || "");
      setDuration(storedDuration || "");
      tags = storedTags || [];
    }
  }, []);

  const data = {
    name,
    isOpen,
    advertiser: JSON.parse(localStorage.getItem("user")).username,
    date,
    location, // Use updated location
    price,
    category,
    tags,
    specialDiscount,
    duration,
  };

  let isClicked = null;

  const validateFields = () => {
    if (!name) {
      message.error("Name is required");
      return false;
    }
    if (!date) {
      message.error("Date is required");
      return false;
    }
    if (!price) {
      message.error("Price is required");
      return false;
    }
    if (!specialDiscount) {
      message.error("Special Discount is required");
      return false;
    }
    if (!duration) {
      message.error("Duration is required");
      return false;
    }
    if (!category) {
      message.error("Category is required");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      localStorage.removeItem("selectedLocation");
      return;
    }

    try {
      await axios.post("http://localhost:8000/activity", data);
      message.success("Activity Created Successfully!");
      localStorage.removeItem("addActivityFormData");
      tags = [];

      // Clear localStorage
      localStorage.removeItem("addActivityFormData");
      localStorage.removeItem("selectedLocation");

      // Navigate to the dashboard after successful submission
      navigate("/advertiserDashboard");
    } catch (error) {
      console.log(data);
      message.error("An error occurred: " + error.message);
      console.error("There was an error creating the activity!", error);
    }
  };

  const handleNavigate = () => {
    // Save all form data in localStorage before navigating
    localStorage.setItem(
      "addActivityFormData",
      JSON.stringify({
        name,
        date,
        isOpen,
        price,
        category,
        specialDiscount,
        duration,
        tags,
      })
    );
    navigate("/location"); // Navigate to /location when button is clicked
  };

  return (
    <div>
      <AdvertiserNavBar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography
            variant="h3"
            className="duckTitle"
            style={styles.welcomeText}
          >
            Add Activity
          </Typography>
        </div>

        <div style={styles.rightSection}>
          <Container maxWidth="sm">
            <Box>
              <h2
                className="bigTitle"
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                Create Activity
              </h2>
              <Grid
                container
                spacing={1}
                direction="column"
                sx={{ marginTop: "20px" }}
              >
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="price"
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <div
                    id="isOpenDiv"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      border: "1px solid rgba(0,0,0,.2)",
                      borderRadius: 5,
                      height: 55,
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(0, 0, 0, 0.6) ",
                        paddingTop: 16,
                        paddingLeft: 12,
                      }}
                    >
                      isOpen
                    </p>
                    <input
                      name="isOpen"

                      label="isOpen"
                      type="checkbox"
                      checked={isOpen}
                      style={{
                        alignSelf: "center",
                        marginRight: 12,
                        borderRadius: "5px",
                        color: "#ff9933"
                      }}
                      onChange={() => setIsOpen(!isOpen)}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="specialDiscount"
                    label="Discount"
                    type="number"
                    value={specialDiscount}
                    onChange={(e) => setSpecialDiscount(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="date"
                    onSelect={() => {
                      isClicked = true;
                    }}
                    label={isClicked ? "Date" : ""}
                    type={"datetime-local"}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="duration"
                    label="Duration"
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setCategory(localStorage.getItem("category"));
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="location"
                    label="Location"
                    type="text"
                    value={location} // Location input
                    disabled // Make it non-editable, coming from the map
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: "orange" }}
                    onClick={handleNavigate} // Use the handleNavigate function for routing
                    fullWidth
                  >
                    Go to Location
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <CategoriesDropDown style={{ backgroundColor: "orange" }} />
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      display: "Flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      flexBasis: 10,
                    }}
                  >
                    {allTags.map((element) => {
                      return (
                        <StandAloneToggleButton
                          tags={tags}
                          key={element._id}
                          name={element.name}
                        />
                      );
                    })}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleAdd}
                    style={{
                      width: "100%",
                      backgroundColor: "orange",
                      color: "white",
                      border: "none",
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  >
                    Add Activity
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "120vh",
    width: "100vw",
    background: 'url("/duckActivity.jpg") no-repeat left center fixed',
    backgroundSize: "cover",
    overflowY: "visible",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "20px",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  centeredSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
    position: "fixed",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default AddActivityForm;
