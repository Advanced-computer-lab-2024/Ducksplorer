import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { IconButton, Box, Paper, Container, Grid, TextField, Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StandAloneToggleButtonIt from "../../Components/ToggleItinerary";
import TourGuideSidebar from "../../Components/Sidebars/TourGuideSidebar";
import TourGuideNavbar from "../../Components/TopNav/TourGuideNavbar";
export const TagsContext = createContext();
let tags = [];

const AddItinerary = () => {
  const navigate = useNavigate();

  //prevents changing numbers lama bena3mel scroll bel mouse
  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

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

  const isGuest = localStorage.getItem("guest") === "true";

  const [prefTagsOptions, setPrefTagsOptions] = useState([]);
  const [locations, setLocations] = useState([""]);
  const [availableDatesAndTimes, setAvailableDatesAndTimes] = useState([""]);
  const [activities, setActivities] = useState([
    {
      name: "",
      isOpen: false,
      date: "",
      location: "",
      price: "",
      category: "",
      tags: "",
      duration: "",
    },
  ]);

  const [formData, setFormData] = useState({
    locations: [],
    timeline: "",
    language: "",
    price: "",
    availableDatesAndTimes: [],
    accessibility: "",
    pickUpLocation: "",
    dropOffLocation: "",
    tag: {
      name: "",
    },
  });

  //fetch all tags from the server
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/preferenceTags/");
        const data = await response.json();
        setPrefTagsOptions(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  //changes the value of the datetime when creating from default value to the value entered
  const handleAvailableDateChange = (index, value) => {
    const newDates = [...availableDatesAndTimes];
    newDates[index] = value;
    setAvailableDatesAndTimes(newDates);
    setFormData({ ...formData, availableDatesAndTimes: newDates });
  };

  //changes the values of attributes inside the activity when creating from default value to the value entered
  const handleActivityChange = (index, field, value) => {
    const updatedActivities = activities.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    );
    setActivities(updatedActivities);
  };

  //changes the value of any general attribute when creating and the new value is added to the formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //to append a new location in the array of locations
  const handleAddLocation = () => {
    setLocations([...locations, ""]);
  };

  //to append a new available date and time in the array of dates
  const handleAddAvailableDate = () => {
    setAvailableDatesAndTimes([...availableDatesAndTimes, ""]);
  };

  //to append a new activity in the array of activities
  const handleAddActivity = () => {
    const newActivity = {
      name: "",
      isOpen: false,
      date: "",
      location: "",
      price: "",
      category: "",
      tags: "",
      duration: "",
    };
    setActivities([...activities, newActivity]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    try {
      console.log(tags);
      const response = await axios.post("http://localhost:8000/itinerary/", {
        activity: activities,
        locations,
        timeline: formData.timeline,
        language: formData.language,
        price: formData.price,
        availableDatesAndTimes,
        accessibility: formData.accessibility,
        pickUpLocation: formData.pickUpLocation,
        dropOffLocation: formData.dropOffLocation,
        tourGuideUsername: userName,
        tags, // Make sure to include selected tags here
      });
      console.log(response.data);

      if (response.status === 200) {
        message.success("Itinerary added successfully");
        // Reset form data here
        resetForm();
        navigate("/tourGuideDashboard");
      } else {
        message.error("Failed to add itinerary");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  //restests all the values of attributes when needed (ex. adding new input) before adding the new values
  const resetForm = () => {
    setActivities([
      {
        name: "",
        isOpen: false,
        date: "",
        location: "",
        price: "",
        category: "",
        tags: "",
        duration: "",
      },
    ]);
    setLocations([""]);
    setAvailableDatesAndTimes([""]);
    setFormData({
      name: "",
      locations: [],
      timeline: "",
      language: "",
      price: "",
      accessibility: "",
      pickUpLocation: "",
      dropOffLocation: "",
      tag: {
        name: "",
      },
    });
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: `url("/duckItinerary.jpg") no-repeat left center fixed`,
      backgroundSize: "cover",
      overflow: "hidden", // Ensure the page itself is unscrollable
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
      overflow: "hidden", // Ensure the page itself is unscrollable
    },
    rightSection: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.95)",
      padding: "20px", // Add padding to fit more in the right section
      overflow: "hidden", // Prevent scrolling in the right section
    },
    welcomeText: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    descriptionText: {
      fontSize: "1.5rem",
      textAlign: "center",
    },
    textField: {
      width: "90%", // Shorten the text boxes
    },
    content: {
      width: "100%",
      maxWidth: "400px",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 11px 1px",
      textAlign: "center",
      backgroundColor: "white",
      maxHeight: "80vh", // Add this line
      overflowY: "auto", // Add this line
    },
    formContainer: {
      paddingTop: "70px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%", // Center the form vertically
    },
  };

  return (
    <>
      <TourGuideNavbar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography variant="h3" style={styles.welcomeText}>
            Create Itinerary
          </Typography>
          <Typography variant="h1" style={styles.descriptionText}>
            Plan your perfect trip with ease.
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Container maxWidth="sm" style={styles.formContainer}>
            <Paper
              elevation={3}
              sx={{
                padding: "40px",
                borderRadius: "1.5cap",
                width: "100%",
                height: "80vh",
                overflowY: "auto", // Make the form scrollable
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
              }}
            >
              <Box sx={{ overflowY: "visible", height: "100%" }}>
                <h2
                  className="bigTitle"
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  Create Itinerary
                </h2>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  {activities.map((activity, index) => (
                    <Grid container spacing={1} direction="column" sx={{ marginTop: "20px" }} key={index}>
                      <Grid item xs={12}>
                        <TextField
                          name="name"
                          label="Activity Name"
                          type="text"
                          value={activity.name}
                          onChange={(e) => handleActivityChange(index, "name", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="price"
                          label="Activity Price"
                          type="number"
                          value={activity.price}
                          onChange={(e) => handleActivityChange(index, "price", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
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
                            width: "90%", // Shorten the text boxes
                          }}
                        >
                          <p
                            style={{
                              color: "rgba(0, 0, 0, 0.6) ",
                              marginRight: "auto",
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
                            checked={activity.isOpen}
                            onChange={() => handleActivityChange(index, "isOpen", !activity.isOpen)}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="date"
                          label="Activity Date"
                          type="datetime-local"
                          value={activity.date}
                          onChange={(e) => handleActivityChange(index, "date", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="location"
                          label="Activity Location"
                          type="text"
                          value={activity.location}
                          onChange={(e) => handleActivityChange(index, "location", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="category"
                          label="Activity Category"
                          type="text"
                          value={activity.category}
                          onChange={(e) => handleActivityChange(index, "category", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="tags"
                          label="Activity Tags"
                          type="text"
                          value={activity.tags}
                          onChange={(e) => handleActivityChange(index, "tags", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="duration"
                          label="Activity Duration"
                          type="text"
                          value={activity.duration}
                          onChange={(e) => handleActivityChange(index, "duration", e.target.value)}
                          required
                          style={styles.textField} // Apply the shortened width
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <IconButton
                    onClick={handleAddActivity}
                    sx={{ width: "50px", height: "50px", alignSelf: "center" }}
                  >
                    <AddCircleIcon
                      style={{
                        color: "ff9933",
                      }}
                    />
                  </IconButton>
                  <h3>Locations:</h3>
                  {locations.map((location, index) => (
                    <Grid container spacing={1} direction="column" sx={{ marginTop: "20px" }} key={index}>
                      <Grid item xs={12}>
                        <TextField
                          name="location"
                          label="Location"
                          type="text"
                          value={location}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index] = e.target.value;
                            setLocations(newLocations);
                          }}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <IconButton
                    onClick={handleAddLocation}
                    sx={{ width: "50px", height: "50px", alignSelf: "center" }}
                  >
                    <AddCircleIcon
                      style={{
                        color: "ff9933",
                      }}
                    />
                  </IconButton>
                  <Grid container spacing={1} direction="column" sx={{ marginTop: "20px" }}>
                    <Grid item xs={12}>
                      <TextField
                        name="timeline"
                        label="Timeline in days"
                        type="text"
                        value={formData.timeline}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="language"
                        label="Language"
                        type="text"
                        value={formData.language}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="price"
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        style={{
                          marginTop: "16px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Available Dates and Times:
                      </Typography>
                      {availableDatesAndTimes.map((dateTime, index) => (
                        <TextField
                          key={index}
                          name="availableDatesAndTimes"
                          label="Available Date and Time"
                          type="datetime-local"
                          value={dateTime}
                          onChange={(e) => handleAvailableDateChange(index, e.target.value)}
                          fullWidth
                          required
                        />
                      ))}
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={handleAddAvailableDate}
                    sx={{ width: "50px", height: "50px", alignSelf: "center" }}
                  >
                    <AddCircleIcon
                      style={{
                        color: "ff9933",
                      }}
                    />
                  </IconButton>
                  <Grid container spacing={1} direction="column" sx={{ marginTop: "20px" }}>
                    <Grid item xs={12}>
                      <TextField
                        name="accessibility"
                        label="Accessibility"
                        type="text"
                        value={formData.accessibility}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="pickUpLocation"
                        label="Pick Up Location"
                        type="text"
                        value={formData.pickUpLocation}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="dropOffLocation"
                        label="Drop Off Location"
                        type="text"
                        value={formData.dropOffLocation}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      display: "Flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      flexBasis: 10,
                    }}
                  >
                    {prefTagsOptions.map((element) => {
                      return (
                        <TagsContext.Provider key={element._id} value={tags}>
                          <StandAloneToggleButtonIt
                            key={element._id}
                            name={element.name}
                          />
                        </TagsContext.Provider>
                      );
                    })}
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    className="blackhover"
                    sx={{
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      borderRadius: "8px",
                      backgroundColor: "#3f51b5",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Add Itinerary
                  </Button>
                </form>
              </Box>
            </Paper>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AddItinerary;
