
# Ducksplorer: Get Your Ducks in a Row! 

Ducksplorer is your all-in-one travel companion, designed to make vacation planning seamless, organized, and enjoyable. Inspired by the saying *"get your ducks in a row,"* which means to have everything well-planned and in perfect order, Ducksplorer ensures that every detail of your trip is taken care of. Whether you’re drawn to historic landmarks, serene beaches, or adventurous getaways, Ducksplorer combines personalized planning, seamless booking, smart budgeting, and curated local recommendations into one intuitive platform. With features like real-time notifications, customizable itineraries, and even an exclusive gift shop, Ducksplorer helps you plan, organize, and execute your dream vacation effortlessly. Start exploring with Ducksplorer and experience hassle-free travel like never before!  

## Motivation
Ducksplorer was initially conceived as a project for our Advanced Computer Lab course, a requirement of our university curriculum. However, our purpose went far beyond fulfilling academic obligations. We saw this as an opportunity to learn and apply advanced programming concepts, collaborate effectively as a team, and develop a real-world application that solves a genuine problem. Travel planning is often a complex and time-consuming process, and we wanted to design a solution that simplifies and enhances the experience for users. Through this project, we aimed to improve our technical skills, explore innovative features, and create something meaningful that could inspire further development in the future.
## Build Status
The current build of Ducksplorer is stable and free from any critical bugs or errors. However, users may experience slower loading times due to the resource-intensive nature of the platform. This is because Ducksplorer integrates multiple features and services, such as real-time notifications, curated recommendations, and seamless booking options, all of which utilize significant computational resources. While the platform is fully functional, optimizing loading performance is a key area we aim to address in future updates. We appreciate your understanding and welcome any suggestions to improve this aspect of the application.  

## Code Style

For Ducksplorer, we adhered to a camel casing style for naming variables, functions, and other identifiers. While no formal style guide was strictly followed, we focused on maintaining consistency and clarity in the code through team collaboration. Contributors were encouraged to write clean, readable, and well-documented code to ensure the project remains easy to understand and maintain.

## Screenshots/Videos of the website

Here is a link to a folder on google drive:

https://drive.google.com/drive/folders/1QEX_bJYIjdphBVo_t6tFjP5BgRcCnQ10?usp=sharing

## Tech/Framework used

In Ducksplorer, we used the MERN stack to build the application. The frontend is developed using React, which allows for a dynamic and responsive user interface. For the backend, we used Node.js along with Express.js to handle routing and server-side logic efficiently. The database is managed using Mongoose, which provides an easy-to-use Object Data Modeling (ODM) tool for MongoDB, simplifying database interactions. This tech stack ensures a robust, scalable, and high-performance application. To fully understand and contribute to the project, familiarity with these technologies is essential.

## Features

Ducksplorer stands out by offering a fully personalized travel planning experience, allowing users to tailor their trips based on specific interests. Unlike other platforms, it integrates seamless bookings for flights, hotels, and transportation, all within the app—no redirects required. It also provides intelligent budgeting suggestions that ensure your activities fit within your remaining budget. What sets Ducksplorer apart is its curated list of local activities, museums, and landmarks, complete with ticket prices and directions, plus real-time updates on upcoming events. The app also features customizable itineraries and expert-guided tours, making it perfect for both spontaneous and well-planned travelers. Lastly, an in-app gift shop adds a unique touch, allowing you to purchase local souvenirs to remember your trip.

## Code Examples
### 1. BE Routes Example:
```javascript
 
router.route("/filter").get(filterItineraries);

router.route("/deletePast").delete(deletePastItineraries);

router.route("/search").get(searchItineraries);

router.route("/upcoming").get(getUpcomingItineraries);

router.route("/filterUpcoming").get(filterUpcomingItineraries);

router.route("/myItineraries/:userName").get(getAllMyItineraries);

 ```
### 2. BE Create Itinerary Controller Example:
```javascript
 
const createItinerary = async (req, res) => {
    
  const {
    name,
    activity,
    locations,
    timeline,
    language,
    price,
    availableDatesAndTimes,
    accessibility,
    pickUpLocation,
    dropOffLocation,
    tourGuideUsername,
    rating,
    tags,
    flag,
  } = req.body;

  console.log(req.body);

  try {
    const tourGuide = await tourGuideModel.findOne({
      userName: tourGuideUsername,
    });

    if (!tourGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }

    const itinerary = await itineraryModel.create({
      name,
      activity,
      locations,
      timeline,
      language,
      price,
      availableDatesAndTimes,
      accessibility,
      pickUpLocation,
      dropOffLocation,
      tourGuideModel: tourGuide._id,
      rating,
      tags,
      flag,
    });

    res.status(200).json(itinerary);
  } 

  catch (error) {

    res.status(400).json({ error: error.message });
  }
};

```
 
### 3. BE Itinerary Model Example:
```javascript
const mongoose = require("mongoose");
const { schema } = require("./activityModel"); // This line is correct
const Activity = require("./activityModel");
const Schema = mongoose.Schema;
const TourGuide = require("./tourGuideModel");
const Tags = require("./preferenceTagsModels");
const ItineraryBooking = require("./itineraryBookingModel");

const itinerarySchema = new Schema(
  {
    name: {
      type: String,
    },
    activity: {
      type: Array,
      schema: [Activity],
      required: true,
    },
    locations: {
      type: Array,
      schema: [String],
      required: true,
    },
    timeline: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDatesAndTimes: {
      type: [Date],
      required: true,
    },
    accessibility: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
    },
    tourGuideModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: false,
    },
    bookedCount: {
      type: Number,
      default: 0,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    chosenDate: {
      type: Date,
      required: false,
    },
    flag: {
      //it is true this means the itinerary is inappropriate (since the default of a boolean is false the itinerary starts as appropriate)
      type: Boolean,
      default: false,
      required: false,
    },

    isDeactivated: {
      //created as deactivated because the default of any boolean is false and we want the itinerary to start as active when created (ie with this boolean as false)
      type: Boolean,
      default: false,
      required: false,
    },
    ratings: {
      type: [
        {
          bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItineraryBooking",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
          },
        },
      ],
      default: [],
    },
    averageRating: {
      type: Number,
      required: false,
    },
    comments: {
      type: [String],
      required: false,
    },
    tourGuideDeleted: {
      //when the tour guide associated with this itinerary leaves it should no longer appear to tourists but should stay in the database if it is booked this is why we use this boolean
      type: Boolean,
      default: false,
      required: false,
    },

    //when the tour guide deletes an itinerary it should no longer appear to new tourists but should stay in the database if it is booked this is why we use this boolean
    deletedItinerary: {
      type: Boolean,
      default: false,
      required: false,
    },
    saved: [
      {
        user: { type: String, required: false, default: null }, // Username of the user who saved the activity
        isSaved: { type: Boolean, required: false, default: false }, // Whether the activity is saved
      },
    ],
    totalGain: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
); // Moved timestamps to schema options here

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;
```

### 4. FE Add Governor Example:
```javascript
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { message } from "antd";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../Components/TopNav/iconify.js";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import AdminNavBar from "../../Components/NavBars/AdminNavBar";
import NavigationTabs from "../../Components/NavigationTabs.js";

function AddGovernor() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const tabs = ["Add Admin", "Add Governor"];
  const paths = ["/addAdmin", "/addGovernor"];

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/addGovernor",
        {
          userName,
          password,
          role: "Governor",
        }
      );
      if (response.status === 200) {
        message.success("Governor added successfully");
      } else {
        message.error("Failed to add Governor");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <AdminNavBar />
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography variant="h3" className="duckTitle" style={styles.welcomeText}>
            Add Users
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f9f9f9",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Chips Section */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "5%",
                position: "relative",
                top: "-25%",
              }}
            >

              <div>
                <NavigationTabs tabNames={tabs} paths={paths} />
              </div>
            </Box>

            {/* Title Section */}
            <h2
              className="bigTitle"
              style={{
                textAlign: "center",
                alignSelf: "center",
                marginBottom: "5%",
                position: "relative", // Add this to use 'top'
                marginTop: "-20%"
              }}
            >
              Add Governor
            </h2>

            {/* Logo Section
            <Box sx={{ marginBottom: "24px" }}>
              <img
                src="logo1.png"
                alt="Logo"
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  justifySelf: "center",
                  width: "150px",
                  height: "auto",
                  marginTop: "5vh",
                  marginBottom: "5vh",
                }}
              />
            </Box> */}

            {/* Form Section */}
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <Stack spacing={3} style={{ justifyContent: "center", alignContent: "center" }}>
                {/* Username Field */}
                <TextField
                  name="username"
                  label="Username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",
                      color: "#ff9933",
                    },
                  }}
                  sx={{
                    width: "150%",
                    margin: "auto",
                    right: "20%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ff9800",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ff9800",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff9800",
                      },
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{ style: { color: "#777" } }}
                  InputProps={{
                    style: {
                      fontSize: "16px",
                      color: "#ff9933",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                            style={{ color: "#ff9800", fontSize: "20px" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "150%",
                    margin: "auto",
                    right: "20%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ff9800",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ff9800",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff9800",
                      },
                    },
                  }}
                />

                {/* Add Governor Button */}
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  sx={{
                    backgroundColor: "#ff9800",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "25px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    width: "100%",
                    justifySelf: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    "&:hover": {
                      backgroundColor: "#e68a00", // Darker hover color
                    },
                  }}
                  fullWidth
                >
                  Add Governor
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "120vh",
    width: "100vw",
    background: 'url("/duckAdmin.jpg") no-repeat left center fixed',
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
    position: "fixed",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default AddGovernor;
```

### 5. FE Create Itinerary Example:
```javascript
import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Box,Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StandAloneToggleButtonIt from "../../Components/ToggleItinerary";
export const TagsContext = createContext();
let tags = [];

const AddItinerary = () => {

  const navigate = useNavigate();

 
  useEffect(() => { //prevents changing numbers when we scroll with mouse
  
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

  useEffect(() => { //fetch all tags from the server

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


  const handleAvailableDateChange = (index, value) => { //changes the value of the datetime when creating from default value to the value entered

    const newDates = [...availableDatesAndTimes];
    newDates[index] = value;
    setAvailableDatesAndTimes(newDates);
    setFormData({ ...formData, availableDatesAndTimes: newDates });
  };

  const handleActivityChange = (index, field, value) => {  //changes the values of attributes inside the activity when creating from default value to the value entered

    const updatedActivities = activities.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    );
    setActivities(updatedActivities);
  };

  const handleChange = (e) => {  //changes the value of any general attribute when creating and the new value is added to the formData

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleAddLocation = () => { //to append a new location in the array of locations

    setLocations([...locations, ""]);
  };

  const handleAddAvailableDate = () => {  //to append a new available date and time in the array of dates

    setAvailableDatesAndTimes([...availableDatesAndTimes, ""]);
  };


  const handleAddActivity = () => {  //to append a new activity in the array of activities

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


  const resetForm = () => {  //restests all the values of attributes when needed (ex. adding new input) before adding the new values

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

    <Paper
      elevation={3}
      sx={{
        padding: "40px",
        borderRadius: "1.5cap",
        width: "30vw",
        height: "75vh",
        overflowY: "auto",
      }}

    >
      <Link
        to={isGuest ? "/guestDashboard" : "/touristDashboard"}
        className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
      >
        Back
      </Link>
      <Box sx={{ overflowY: "visible", height: "100vh" }}>
        <h1>Create an Itinerary</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {activities.map((activity, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Activity Name"
                value={activity.name}
                onChange={(e) =>
                  handleActivityChange(index, "name", e.target.value)
                }
                required
              />
              <label>Activity Is Open?</label>
              <input
                type="checkbox"
                checked={activity.isOpen}
                onChange={(e) =>
                  handleActivityChange(index, "isOpen", e.target.checked)
                }
              />
              <input
                type="datetime-local"
                placeholder="Activity Date"
                value={activity.date}
                onChange={(e) =>
                  handleActivityChange(index, "date", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Activity Location"
                value={activity.location}
                onChange={(e) =>
                  handleActivityChange(index, "location", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Activity Price"
                value={activity.price}
                onChange={(e) =>
                  handleActivityChange(index, "price", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Activity Category"
                value={activity.category}
                onChange={(e) =>
                  handleActivityChange(index, "category", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Activity Tags"
                value={activity.tags}
                onChange={(e) =>
                  handleActivityChange(index, "tags", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Activity Duration"
                value={activity.duration}
                onChange={(e) =>
                  handleActivityChange(index, "duration", e.target.value)
                }
                required
              />
            </div>
          ))}
          <IconButton onClick={handleAddActivity}>
            <AddCircleIcon color="primary" />
          </IconButton>
          <h3>Locations:</h3>
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
            />
          ))}
          <IconButton onClick={handleAddLocation}>
            <AddCircleIcon color="primary" />
          </IconButton>
          <input
            type="text"
            name="timeline"
            placeholder="Timeline in days"
            value={formData.timeline}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            required
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
          />
          <h3>Available Dates and Times:</h3>
          {availableDatesAndTimes.map((dateTime, index) => (
            <input
              key={index}
              type="datetime-local"
              placeholder="Available Date and Time"
              value={dateTime}
              onChange={(e) => handleAvailableDateChange(index, e.target.value)} // Update date/time
              required
            />
          ))}
          <IconButton onClick={handleAddAvailableDate}>
            <AddCircleIcon color="primary" />
          </IconButton>
          <input
            type="text"
            name="accessibility"
            placeholder="Accessibility"
            value={formData.accessibility}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pickUpLocation"
            placeholder="Pick Up Location"
            value={formData.pickUpLocation}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dropOffLocation"
            placeholder="Drop Off Location"
            value={formData.dropOffLocation}
            onChange={handleChange}
            required
          />
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
          <button type="submit">Add Itinerary</button>
        </form>
      </Box>
    </Paper>
  );
};

export default AddItinerary;
```
## Installation

To get started with Ducksplorer, you'll need to install several software tools and dependencies. Below are the steps for installation:

### 1. Install Visual Studio Code (VS Code)
   - VS Code is a powerful and popular code editor. Download and install it from [here](https://code.visualstudio.com/download). Choose the version suitable for your operating system.

### 2. Install Node.js
   - **Node.js** is required for running both the backend and frontend of the project. Download it from [Node.js official website](https://nodejs.org/). Make sure to choose the version appropriate for your operating system.
   - Verify the installation by running the following command in your terminal:
     ```
     node -v
     ```

### 3. Install Nodemon
   - **Nodemon** automatically restarts the server when code changes are made. Install it globally by running the following command:
     ```
     npm install -g nodemon
     ```

### 4. Install Express.js
   - **Express.js** is a backend framework used for routing in the project. Install it by running:
     ```
     npm install express
     ```

### 5. Install Mongoose
   - **Mongoose** is used for database interaction. Install it by running:
     ```
     npm install mongoose
     ```

### 6. Install React
   - **React** is used for building the frontend of the application. You can install it by running:
     ```
     npx create-react-app .
     ```

### 7. Install Axios
   - **Axios** is used for making HTTP requests to the backend. Install it by running:
     ```
     npm install axios
     ```

### 8. Install Git
   - **Git** is required for version control and cloning the repository. Download and install it from [Git's official site](https://git-scm.com/).

### 9. Install MongoDB (Atlas)
   - **MongoDB Atlas** is the cloud version of MongoDB. You can create a free account and get started with it [here](https://www.mongodb.com/atlas/database).
   - For setting up MongoDB Atlas and connecting it to your project, watch this helpful video between 1:00 - 2:40 to create an Atlas cluster, and then refer to 3:20 - 6:10 for instructions on connecting your database to your code. [Watch the video](https://www.youtube.com/watch?v=s0anSjEeua8&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&index=4).

### 10. Install Postman
   - **Postman** is a tool for testing APIs. Download and install it from [Postman download page](https://www.postman.com/downloads/), and choose the version suitable for your operating system.

By following these steps, you should be able to successfully install everything you need for the Ducksplorer project. If you encounter any issues, feel free to consult the links provided for additional setup help.

## API References

There is a JSON file  inside the Ducksplorer of our collection exported.

You will also find here the link to our collection with all of the routes:

https://ducksplorer.postman.co/workspace/Ducksplorer-Workspace~5c7001a0-23f3-4f93-8a1e-6093d038ce71/documentation/38513704-03aa45d1-f23b-4ac6-aeb8-d77ccc819819


## Tests

### 1. Create Itinerary
http://localhost:8000/itinerary/

TYPE:
POST

BODY:
{
  “name” : “Fun Tour”,
  "activity": [
    {
      "name": "Hiking",
      "description": "A guided hike through the mountains.",
      "duration": "3 hours",
      "category": "Adventure"
    },
    {
      "name": "City Tour",
      "description": "Explore the city's historical sites.",
      "duration": "5 hours",
      "category": "Cultural"
    }
  ],
  "locations": [
    "Mountain Range",
    "City Center"
  ],
  "timeline": "2024-10-15 09:00 - 2024-10-15 18:00",
  "language": "English",
  "price": 150,
  "availableDatesAndTimes": [
    "2024-10-15T09:00:00.000Z",
    "2024-11-20T09:00:00.000Z"
  ],
  "accessibility": "Wheelchair accessible",
  "pickUpLocation": "123 Main Street, City Center",
  "dropOffLocation": "Hotel Plaza, West End",
  "tourGuideModel": "650de91e9f456d2a088fd2b2",
  "rating": 4.5
}

### 2. Get All Itineraries
http://localhost:8000/itinerary/

TYPE:
GET

### 3. Update Itineraries
http://localhost:8000/itinerary/66fc55668a48193456663264

TYPE:
PUT

BODY:
{
    "locations": [
        "Nuweiba",
        "Abo galloum",
        "Wadi Rum"
    ],
    "timeline": "2024-10-10T10:00:00Z",
    "language": "English",
    "price": 600,
    "availableDates": "2025-10-10",
    "availableTimes": "09:00 AM - 05:00 PM",
    "accessibility": "Wheelchair accessible",
    "pickUpLocation": "Dahab Town Center",
    "dropOffLocation": "Cairo"
}

### 4. Delete Itineraries 
http://localhost:8000/itinerary/6729242e64943e4de328fb59

TYPE:
DELETE

### 5. Sort Itineraries By Price
http://localhost:8000/itinerary/sort?sortBy=price

TYPE:
GET

### 6. Filter Itineraries By Language
http://localhost:8000/itinerary/filter?language=English

TYPE:
GET

### 7. Create omplaint
http://localhost:8000/complaint/

TYPE:
POST

BODY:
{
    "title": "complaint test",
    "body": "website is mid",
    "tourist": "alya123",
    "status": false
}

### 8. Get Complaint By ID
http://localhost:8000/complaint/670a9ab6b6ad1da80ab7e1ed

TYPE:
GET

### 9. Update Complaint Status
http://localhost:8000/complaint/670aa5a7c9bb4be55c0e2378

TYPE:
PUT

BODY:
{
    "status" : true
}

### 10. Rate Itinerary
http://localhost:8000/itinerary/rateItinerary/672fc46d0213d8f581026eb6

TYPE:
PATCH

BODY:
{
    "rating" : 4
}

### 11. Get All My Bookings

http://localhost:8000/touristRoutes/booking?tourist=noha1

TYPE:
GET

### 12. Filter Revenue Report For Itineraries

http://localhost:8000/admin/filterReportItineraries?month=1&year=2025

TYPE:
GET

### 13. Get All Users Data (email, role, date, userName)

http://localhost:8000/admin/getAllUsersWithEmails

TYPE:
GET

### 14. Update Points And Wallet Upon Paying

http://localhost:8000/touristRoutes/payWallet/noha1

TYPE: PATCH

BODY: {
  "finalPrice": "100"
}


### 15. Get Level Of Tourist

http://localhost:8000/touristRoutes/getLevel/noha1

TYPE: GET

## How To Use?
Follow the steps below to set up and use Ducksplorer on your local machine. This guide assumes you have already completed the installation process mentioned earlier.

### 1. Clone the repository:
   ```
  git clone https://github.com/Advanced-computer-lab-2024/Ducksplorer.git
   ```

### 2. Navigate to the project directory:
   ```
   cd ducksplorer
   ```

### 3. Install the required dependencies:
   ```
   npm install
   ```

### 4. Set Up Environment Variables
- Create a `.env` file in the root of the project and add your MongoDB connection string, like:
  ```
  MONGO_URI=mongodb://localhost:8000/ducksplorer
  ```

### 5. Run the Backend Server
- Start the backend server using Nodemon to automatically reload the server on code changes: nodemon server.js.
- Your backend server will run on http://localhost:8000.

### 6. Run the Frontend Application
- Open a new terminal window or tab.
- Navigate to the frontend folder: cd frontend
- Start the React development server: npm start
- The frontend will be available at http://localhost:3000.

### 7. Use the Application
Using this application, you can for example:
- Plan your trip by selecting your travel preferences (e.g., historic sites, beaches, shopping).
- Book flights, hotels, and transportation directly within the app.
- Discover local gems, activities, and guided tours for your destination.
- Buy products from the gift shop

### 8. Test API Endpoints 
If you're a developer and want to test the API, you can use Postman or any other API testing tool:
Import the Postman collection shared in the project documentation.

### 9. Log Out or Restart
Once you're done using the app, you can stop the development servers by pressing Ctrl+C in the terminal for each server.

By following these steps, you should be able to get Ducksplorer running on your local machine and begin planning your trips or exploring the app's features. 
## Contribute

We welcome contributions to Ducksplorer! If you'd like to help improve the app or fix any issues, here's how you can get started.

### 1. Performance Optimization:
- The app is currently a little slow in certain areas, particularly when loading resources. We need help identifying performance bottlenecks and optimizing both the frontend for better speed and efficiency.

### 2. Folder Structure and Organization:

- While we've already implemented separation of concerns, we need further improvements in the project’s organization.Each document should have a well-defined purpose and should be located in the most appropriate folder. Contributions that help make the folders clear, specific, and goal-oriented are welcome. If you have ideas for improving or reorganizing our documentation, please contribute to making it more structured and easier to follow as the code grows.

### 3. Frontend Coherence and User Interface:

- The frontend UI/UX could be improved to make the design more consistent, and user-friendly. Help in aligning the visual elements and improving the user experience is highly appreciated.

### 4. Database Optimization:

- Help with optimizing the app’s interactions with the database would be highly valuable. If you have experience with MongoDB and Mongoose, improving the queries and performance with larger datasets would be a great addition.

## Credits
We would like to give credit to the following resources, which were essential in helping us build and understand various technologies used in this project. These resources include YouTube channels, tutorials, and articles.

### 1. YouTube Channels:
-  NetNinja
- Traversy Media

### 2. Specific YouTube Playlists and Videos:
- **Node.js Playlist**: [Node.js Beginner Tutorial](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY)
- **Express.js Tutorial**: [Express.js Tutorial](https://www.youtube.com/watch?v=fgTGADljAeg)
- **React Introduction Playlist**: [React.js Introduction](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)
- **React Hooks - Functional Components**: [React Hooks Playlist](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h)
- **useState vs useEffect**: [useState and useEffect Comparison](https://youtu.be/hQAHSlTtcmY)


### 3. Articles:
- **[Express.js Documentation](https://expressjs.com/)** - The official documentation for Express.js, a crucial part of our backend stack.
- **[MongoDB Documentation](https://www.mongodb.com/docs/)** - MongoDB’s official docs helped in understanding how to properly interact with the database using Mongoose.
- **[React Documentation](https://reactjs.org/docs/getting-started.html)** - The official React documentation that helped with understanding React components, hooks, and best practices.
-  **[Stack Overflow](https://stackoverflow.com/)** - The go-to forum for troubleshooting errors and finding solutions to common coding problems.

## License

This project is licensed under the following licenses:

- **ISC License**
- **MIT License**
- **Apache License 2.0**
Here is a summary of each license:
- **ISC License**: A permissive license that is simple and free of any major restrictions.
- **MIT License**: A permissive free software license, allowing users to do anything with the software as long as they include the original copyright notice and disclaimers.
- **Apache License 2.0**: Allows for modifications and distribution, with an added focus on patent rights, ensuring that contributors cannot later claim patent infringement against users.

Feel free to choose the license that best fits your use case.
