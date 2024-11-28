import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Box, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StandAloneToggleButtonIt from "../../Components/ToggleItinerary";
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
  useEffect(() => {
    // Apply styles to the body when the component mounts
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";

    // Clean up styles when the component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
      document.body.style.display = "";
      document.body.style.justifyContent = "";
      document.body.style.alignItems = "";
      document.body.style.height = "";
    };
  }, []);

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
        to={isGuest ? "/guestDashboard" : "/tourGuideDashboard"}
        className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
      >
        Back
      </Link>

      <h1>Create an Itinerary</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        {activities.map((activity, index) => (
          <div key={index}>
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Activity Name
              </span>
              <input
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                value={activity.name}
                onChange={(e) =>
                  handleActivityChange(index, "name", e.target.value)
                }
                required
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                checked={activity.isOpen}
                onChange={(e) =>
                  handleActivityChange(index, "isOpen", e.target.checked)
                }
              />
              <label class="form-check-label" for="flexCheckDefault">
                Activity Is Open?
              </label>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Activity Date
              </span>
              <input
                type="datetime-local"
                placeholder="Activity Date"
                class="form-control"
                value={activity.date}
                onChange={(e) =>
                  handleActivityChange(index, "date", e.target.value)
                }
                required
              />
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Activity Location
              </span>
              <input
                type="text"
                value={activity.location}
                class="form-control"
                onChange={(e) =>
                  handleActivityChange(index, "location", e.target.value)
                }
                required
              />
            </div>

            <div class="input-group mb-3">
              <input
                class="form-control"
                type="number"
                value={activity.price}
                placeholder="Activity Price"
                onChange={(e) =>
                  handleActivityChange(index, "price", e.target.value)
                }
                required
              />
              <span class="input-group-text">$</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Activity Category
              </span>
              <input
                class="form-control"
                type="text"
                value={activity.category}
                onChange={(e) =>
                  handleActivityChange(index, "category", e.target.value)
                }
                required
              />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Activity Tags
              </span>
              <input
                type="text"
                class="form-control"
                value={activity.tags}
                onChange={(e) =>
                  handleActivityChange(index, "tags", e.target.value)
                }
                required
              />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Activity Duration
              </span>
              <input
                type="text"
                class="form-control"
                value={activity.duration}
                onChange={(e) =>
                  handleActivityChange(index, "duration", e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}
        <IconButton
          onClick={handleAddActivity}
          sx={{
            borderRadius: "100%",
            width: "50px",
            height: "50px",
            alignSelf: "center",
          }}
        >
          <AddCircleIcon color="primary" />
        </IconButton>
        <h3>Locations:</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {locations.map((location, index) => (
              <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">
                  Location
                </span>
                <input
                  class="form-control"
                  type="text"
                  key={index}
                  value={location}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[index] = e.target.value;
                    setLocations(newLocations);
                  }}
                  required
                />
              </div>
            ))}
          </div>
          <IconButton
            onClick={handleAddLocation}
            sx={{
              height: "50px",
              width: "50px",
              borderRadius: "100%",
            }}
          >
            <AddCircleIcon color="primary" />
          </IconButton>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-default">
            Timeline in days
          </span>
          <input
            type="text"
            class="form-control"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            required
          />
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-default">
            Language
          </span>
          <input
            type="text"
            name="language"
            class="form-control"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>

        <div class="input-group mb-3">
          <input
            type="number"
            name="price"
            class="form-control"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
          <span class="input-group-text">$</span>
        </div>
        <h3>Available Dates And Times:</h3>

        {availableDatesAndTimes.map((dateTime, index) => (
          <div class="input-group mb-3">
            <span class="input-group-text" id="inputGroup-sizing-default">
              Available Date and Time
            </span>
            <input
              key={index}
              class="form-control"
              type="datetime-local"
              placeholder="Available Date and Time"
              value={dateTime}
              onChange={(e) => handleAvailableDateChange(index, e.target.value)} // Update date/time
              required
            />
          </div>
        ))}
        <IconButton
          onClick={handleAddAvailableDate}
          sx={{
            height: "50px",
            width: "50px",
            borderRadius: "100%",
            alignSelf: "center",
          }}
        >
          <AddCircleIcon color="primary" />
        </IconButton>

        <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-default">
            Accessibility
          </span>
          <input
            type="text"
            name="accessibility"
            class="form-control"
            value={formData.accessibility}
            onChange={handleChange}
            required
          />
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-default">
            Pick Up Location
          </span>
          <input
            type="text"
            name="pickUpLocation"
            value={formData.pickUpLocation}
            onChange={handleChange}
            class="form-control"
            required
          />
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-default">
            Pick Up Location
          </span>
          <input
            type="text"
            name="dropOffLocation"
            placeholder="Drop Off Location"
            value={formData.dropOffLocation}
            class="form-control"
            onChange={handleChange}
            required
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
        <button type="submit">Add Itinerary</button>
      </form>
    </Paper>
  );
};

export default AddItinerary;
