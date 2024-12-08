import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { IconButton, Box, Paper, Container, Grid, TextField, Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StandAloneToggleButtonIt from "../../Components/ToggleItinerary";
import TourGuideSidebar from "../../Components/Sidebars/TourGuideSidebar";
import TourGuideNavBar from "../../Components/NavBars/TourGuideNavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
export const TagsContext = createContext();
let tags = [];

const AddItinerary = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);

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
        name: formData.name,
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

  const handleNextSection = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePreviousSection = () => {
    setCurrentSection(currentSection - 1);
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden"; // Disable scrolling
    document.body.style.height = "100%"; // Ensure full height
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <TourGuideNavBar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography
            variant="h3"
            className="duckTitle"
            style={styles.welcomeText}
          >
            Add a new itinerary
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Paper
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.65)",
            }}
          >
            <Box sx={{ height: "calc(100% - 1px)", overflowY: "auto", paddingBottom: "56px" }}>
              <h2
                className="bigTitle"
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  marginTop: "7vh",
                }}
              >
                Create Itinerary
              </h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      margin: "2 2 2 2",
                    }}
                  >
                    Itinerary Name
                  </h3>
                  <div style={styles.section}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Itinerary Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      marginTop: "5px",
                    }}
                  >
                    Activities
                  </h3>
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
                            style={{ color: "#ff9933" }}
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
                    <AddCircleIcon style={{ color: "ff9933" }} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      marginTop: "5px",
                    }}
                  >
                    Locations
                  </h3>
                  {locations.map((location, index) => (
                    <div key={index} style={styles.section}>
                      <input
                        key={index}
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => {
                          const newLocations = [...locations];
                          newLocations[index] = e.target.value;
                          setLocations(newLocations);
                        }}
                        required
                        style={styles.input}
                      />
                    </div>
                  ))}
                  <IconButton
                    onClick={handleAddLocation}
                    sx={{ width: "50px", height: "50px", alignSelf: "center" }}
                  >
                    <AddCircleIcon style={{ color: "ff9933" }} />
                  </IconButton>
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      marginTop: "5px",
                    }}
                  >
                    Timeline, Language & Price
                  </h3>
                  <div style={styles.section}>
                    <input
                      type="text"
                      name="timeline"
                      placeholder="Timeline in days"
                      value={formData.timeline}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                    <input
                      type="text"
                      name="language"
                      placeholder="Language"
                      value={formData.language}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      required
                      style={styles.input}
                    />
                  </div>
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      marginTop: "5px",
                    }}
                  >
                    Available Dates & Times
                  </h3>
                  <div style={styles.section}>
                    {availableDatesAndTimes.map((dateTime, index) => (
                      <input
                        key={index}
                        type="datetime-local"
                        placeholder="Available Date and Time"
                        value={dateTime}
                        onChange={(e) =>
                          handleAvailableDateChange(index, e.target.value)
                        }
                        required
                        style={styles.input}
                      />
                    ))}
                    <IconButton
                      onClick={handleAddAvailableDate}
                      sx={{
                        width: "50px",
                        height: "50px",
                        alignSelf: "center",
                      }}
                    >
                      <AddCircleIcon style={{ color: "ff9933" }} />
                    </IconButton>
                  </div>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      marginTop: "5px",
                    }}
                  >
                    General Information
                  </h3>
                  <div style={styles.generalInfo}>
                    <input
                      type="text"
                      name="accessibility"
                      placeholder="Accessibility"
                      value={formData.accessibility}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                    <input
                      type="text"
                      name="pickUpLocation"
                      placeholder="Pick Up Location"
                      value={formData.pickUpLocation}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                    <input
                      type="text"
                      name="dropOffLocation"
                      placeholder="Drop Off Location"
                      value={formData.dropOffLocation}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <h3
                    style={{
                      marginLeft: "1vw",
                      alignSelf: "center",
                      marginTop: "5px",
                    }}
                  >
                    Tags
                  </h3>
                  <div style={styles.tagsContainer}>
                    {prefTagsOptions.map((element) => (
                      <TagsContext.Provider key={element._id} value={tags}>
                        <StandAloneToggleButtonIt
                          key={element._id}
                          name={element.name}
                        />
                      </TagsContext.Provider>
                    ))}
                  </div>
                </Box>
                <div style={styles.submitButtonContainer}>
                  <Button type="submit" style={styles.submitButton}>
                    Add Itinerary
                  </Button>
                </div>
              </form>
            </Box>
          </Paper>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: 'url("/duckItinerary.jpg") no-repeat left center fixed',
    backgroundSize: "cover",
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
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "white",
    position: "fixed",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    height: "100%",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
  },
  input: {
    width: "70%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    alignSelf: "center",
  },
  checkbox: {
    transform: "scale(1.2)",
    alignSelf: "center",
    cursor: "pointer",
    color: "#ff9933",
  },
  generalInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
  },
  tagsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    flexBasis: 10,
  },
  submitButtonContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "16px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "16px",
  },
  submitButton: {
    width: "50%",
    backgroundColor: "#ff9933",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "white",
      color: "#ff9933",
    },
  },
};

export default AddItinerary;
