import { React, useState, useRef, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import TourGuideNavBar from "../../Components/NavBars/TourGuideNavBar"
import StandAloneToggleButton from "../../Components/ToggleButton.js";

import {
  TextField,
  IconButton,
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Rating,
} from "@mui/material";

function EditItinerary() {
  let allTags = JSON.parse(localStorage.getItem("tags"));

  const location = useLocation();
  const { itinerary, data, tags, tagsSelected } = location.state || {};
  const [itineraries, setItineraries] = useState([]); //holds the list of itineraries
  const [open, setOpen] = useState(false); //controls the confirmation message before deletion
  const [selectedItinerary, setselectedItinerary] = useState(itinerary); //stores the currently selected itinerary for deletion
  const [selectedTags, setSelectedTags] = useState(tagsSelected); // For storing selected tags
  const [availableTags, setAvailableTags] = useState(tags); // For storing fetched tags
  const [formData, setFormData] = useState(data);
  const [editingItinerary, setEditingItinerary] = useState(itinerary); // For showing edit form
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  console.log(" i am printing form data ", formData);
  //updates location in formData based on input change
  const handleLocationInputChange = (event, index) => {
    const { value } = event.target;
    setFormData((prevData) => {
      const updatedLocations = [...prevData.locations];
      updatedLocations[index] = value;
      return { ...prevData, locations: updatedLocations };
    });
  };

  //updates activity in formData based on input change
  const handleActivityInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedActivities = [...prevData.activity];
      updatedActivities[index] = {
        ...updatedActivities[index],
        [name]: value,
      };
      return {
        ...prevData,
        activity: updatedActivities,
      };
    });
  };

  //adds a new activity object to the formData
  const addActivity = () => {
    setFormData((prevData) => ({
      ...prevData,
      activity: [
        ...prevData.activity,
        { name: "", price: "", category: "", location: "" },
      ],
    }));
  };

  //deletes an activity based on its index
  const deleteActivity = (index) => {
    const updatedActivities = formData.activity.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      activity: updatedActivities,
    }));
  };

  //updates available dates in formData based on input change
  const handleAvailableDatesInputChange = (event, index) => {
    const { value } = event.target;
    setFormData((prevData) => {
      const updatedDates = [...prevData.availableDatesAndTimes];
      updatedDates[index] = value;
      return { ...prevData, availableDatesAndTimes: updatedDates };
    });
  };

  const handleAddDate = () => {
    setFormData((prevData) => ({
      ...prevData,
      availableDatesAndTimes: [...prevData.availableDatesAndTimes, ""],
    }));
  };

  const handleAddLocation = () => {
    setFormData((prevData) => ({
      ...prevData,
      locations: [...prevData.locations, ""],
    }));
  };

  const handleDeleteDate = (index) => {
    const newDatesAndTimes = formData.availableDatesAndTimes.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, availableDatesAndTimes: newDatesAndTimes }); // Update state
  };

  const handleDeleteLocation = (index) => {
    const newLocations = formData.locations.filter((_, i) => i !== index);
    setFormData({ ...formData, locations: newLocations });
  };

  //for scrolling automatically when we click edit
  const formRef = useRef(null);

  useEffect(() => {
    if (itinerary && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [itinerary]);

  const handleCheckboxChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag); // Remove tag if already selected
      } else {
        return [...prevSelectedTags, tag]; // Add tag if not already selected
      }
    });
  };

  //update
  //submit the updated itinerary data.
  const handleUpdate = (event) => {
    event.preventDefault();

    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    const updatedData = {
      ...formData,
      tags: selectedTags,
    };

    console.log("Updated Data:", updatedData);

    axios
      .put(
        `http://localhost:8000/itinerary/${editingItinerary._id}`,
        updatedData
      )
      .then((response) => {
        if (userName) {
          return axios.get(
            `http://localhost:8000/itinerary/myItineraries/${userName}`
          );
        }
        throw new Error("User not found!");
      })
      .then((response) => {
        setItineraries(response.data);
        message.success("Itinerary updated successfully!");
        setEditingItinerary(null);
        setSelectedTags([]);
        setTimeout(() => {
          navigate("/viewAllTourist");
        }, 2000);
      })
      .catch((error) => {
        console.error(
          "Error updating itinerary or fetching itineraries!",
          error
        );
        message.error(
          `Error updating itinerary: ${error.response ? error.response.data.message : error.message
          }`
        );
      });
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <TourGuideNavBar />

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
            <h2 className="bigTitle"
              style={{ fontWeight: "bold", textAlign: "center" }}>Edit Itinerary</h2>
            <Box />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <form onSubmit={handleUpdate} style={{ marginTop: "20px" }} ref={formRef}>
                {formData.activity &&
                  formData.activity.map((activity, index) => (
                    <div key={index}>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                          label={`Activity ${index + 1} Name`}
                          name="name"
                          value={activity.name || ""}
                          onChange={(e) => handleActivityInputChange(e, index)}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        {index === 0 && (
                          <IconButton onClick={addActivity}>
                            <AddCircleIcon style={{ color: "ff9933" }} />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => deleteActivity(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                      <TextField
                        label={`Activity ${index + 1} Price`}
                        name="price"
                        value={activity.price || ""}
                        onChange={(e) => handleActivityInputChange(e, index)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="number"
                        min="0.01"
                        step="0.01"
                      />
                      <TextField
                        label={`Activity ${index + 1} Category `}
                        name="category"
                        value={activity.category || ""}
                        onChange={(e) => handleActivityInputChange(e, index)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label={`Activity ${index + 1} Location `}
                        name="location"
                        value={activity.location || ""}
                        onChange={(e) => handleActivityInputChange(e, index)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    </div>
                  ))}
                {formData.locations.map((location, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <TextField
                      value={location}
                      onChange={(event) => handleLocationInputChange(event, index)}
                      variant="outlined"
                      fullWidth
                      label={`Location ${index + 1}`}
                    />
                    {index === 0 && (
                      <IconButton onClick={handleAddLocation}>
                        <AddCircleIcon style={{ color: "ff9933" }} />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDeleteLocation(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <TextField
                  label="Timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  type="number"
                  min="0.01"
                  step="0.01"
                />
                {formData.availableDatesAndTimes.map((dateTime, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <TextField
                      label={`Available Date and Time ${index + 1}`}
                      value={dateTime || ""}
                      onChange={(event) =>
                        handleAvailableDatesInputChange(event, index)
                      }
                      fullWidth
                      type="datetime-local"
                    />
                    {index === 0 && (
                      <IconButton onClick={handleAddDate}>
                        <AddCircleIcon style={{ color: "ff9933" }} />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDeleteDate(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <TextField
                  label="Accessbility"
                  name="accessibility"
                  value={formData.accessibility}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Pick Up Location"
                  name="pickUpLocation"
                  value={formData.pickUpLocation}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Drop Off Location"
                  name="dropOffLocation"
                  value={formData.dropOffLocation}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Tags
                  </label>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {allTags.map((element) => {
                      return (
                        <StandAloneToggleButton
                          key={element._id}
                          name={element.name}
                          tags={formData.tags}
                        />
                      );
                    })}
                  </div>
                </div>

                <Button type="submit" variant="contained" className="blackhover" style={{ marginTop: "5%" }}>
                  Update Itinerary
                </Button>
              </form>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default EditItinerary;
