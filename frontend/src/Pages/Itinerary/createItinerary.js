import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Box, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import StandAloneToggleButtonIt from "../../Components/ToggleItinerary";
import Typography from "@mui/joy/Typography";
import TourGuideSidebar from "../../Components/Sidebars/TourGuideSidebar";
import TourGuideNavBar from "../../Components/NavBars/TourGuideNavBar"; // Import the TourGuideNavbar
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

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <TourGuideNavBar />
      <Paper
        elevation={3}
        sx={{
          padding: "40px",
          borderRadius: "1.5cap",
          width: "80vw",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ overflowY: "visible", height: "100vh" }}>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontWeight: "bold",
              fontSize: "32px", // Larger text size for prominence
              color: "black", // Modern primary color
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Subtle text shadow for depth
              fontFamily: "'Roboto', sans-serif", // Clean and modern font
              letterSpacing: "1px", // Slight spacing for elegance
              padding: "8px 16px", // Padding for breathing space
              display: "inline-block", // To match the width of the content
            }}
          >
            Create an Itinerary
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {activities.map((activity, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "24px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Name
                </label>
                <input
                  type="text"
                  placeholder="Activity Name"
                  value={activity.name}
                  onChange={(e) =>
                    handleActivityChange(index, "name", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Is Open?
                </label>
                <input
                  type="checkbox"
                  checked={activity.isOpen}
                  onChange={(e) =>
                    handleActivityChange(index, "isOpen", e.target.checked)
                  }
                  style={{
                    marginBottom: "16px",
                    transform: "scale(1.2)",
                    cursor: "pointer",
                    color: "#ff9933",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Date
                </label>
                <input
                  type="datetime-local"
                  value={activity.date}
                  onChange={(e) =>
                    handleActivityChange(index, "date", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Location
                </label>
                <input
                  type="text"
                  placeholder="Activity Location"
                  value={activity.location}
                  onChange={(e) =>
                    handleActivityChange(index, "location", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Price
                </label>
                <input
                  type="number"
                  placeholder="Activity Price"
                  value={activity.price}
                  onChange={(e) =>
                    handleActivityChange(index, "price", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Category
                </label>
                <input
                  type="text"
                  placeholder="Activity Category"
                  value={activity.category}
                  onChange={(e) =>
                    handleActivityChange(index, "category", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Tags
                </label>
                <input
                  type="text"
                  placeholder="Activity Tags"
                  value={activity.tags}
                  onChange={(e) =>
                    handleActivityChange(index, "tags", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Activity Duration
                </label>
                <input
                  type="text"
                  placeholder="Activity Duration"
                  value={activity.duration}
                  onChange={(e) =>
                    handleActivityChange(index, "duration", e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />
              </div>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "24px",
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    marginBottom: "16px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Add Locations and Details
                </Typography>

                {locations.map((location, index) => (
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
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "16px",
                      outline: "none",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                  />
                ))}

                <Box
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
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
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", color: "#333" }}
                  >
                    Add Location
                  </Typography>
                </Box>

                <input
                  type="text"
                  name="timeline"
                  placeholder="Timeline in days"
                  value={formData.timeline}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                  onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                />

                <input
                  type="text"
                  name="language"
                  placeholder="Language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                  onBlur={(e) => (e.target.style.borderColor = "#ccc")}
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
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "16px",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                  onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                />

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
                  <input
                    key={index}
                    type="datetime-local"
                    placeholder="Available Date and Time"
                    value={dateTime}
                    onChange={(e) =>
                      handleAvailableDateChange(index, e.target.value)
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "16px",
                      outline: "none",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                  />
                ))}
              </div>
            ))}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "16px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "24px",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  marginBottom: "16px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Additional Details
              </Typography>

              <input
                type="text"
                name="accessibility"
                placeholder="Accessibility"
                value={formData.accessibility}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "16px",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />

              <input
                type="text"
                name="pickUpLocation"
                placeholder="Pick Up Location"
                value={formData.pickUpLocation}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "16px",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />

              <input
                type="text"
                name="dropOffLocation"
                placeholder="Drop Off Location"
                value={formData.dropOffLocation}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "16px",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3f51b5")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />
            </div>

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
    </Box>
  );
};

export default AddItinerary;
