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
import StandAloneToggleButton from "../../Components/ToggleButton.js";

import {
    Rating,
    Checkbox,
    FormControlLabel,
    IconButton,
    Box,
    Button,
    Table,
    Typography,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    TextField,
} from "@mui/material";

function EditActivity() {
    let allTags = JSON.parse(localStorage.getItem("tags"));

    const location = useLocation();
    const { activity, data, tags, tagsSelected } = location.state || {};
    const [activities, setActivities] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(activity);
    const [selectedTags, setSelectedTags] = useState(tagsSelected);
    const [availableTags, setAvailableTags] = useState(tags);
    const [formData, setFormData] = useState(data);
    const [editingActivity, setEditingActivity] = useState(activity);
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
        if (activity && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activity]);

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
    //submit the updated activity data.
    const handleUpdate = (event) => {
        event.preventDefault();

        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;

        // Prepare the updated data with the selected tags
        const updatedData = {
            ...formData,
            tags: selectedTags,  // Make sure selectedTags are included
        };

        console.log("Updated Data:", updatedData);

        // Update activity using the PUT request
        axios
            .put(
                `http://localhost:8000/activity/${editingActivity._id}`,  // Update the activity endpoint
                updatedData
            )
            .then((response) => {
                // After updating, fetch the activities by the user's username
                if (userName) {
                    return axios.get(
                        `http://localhost:8000/activity/my/${userName}`  // Fetch activities by the username
                    );
                }
                throw new Error("User not found!");
            })
            .then((response) => {
                setActivities(response.data);  // Set the updated activities list
                message.success("Activity updated successfully!");  // Display success message
                setEditingActivity(null);  // Clear the editing state
                setSelectedTags([]);  // Reset the selected tags
                setTimeout(() => {
                    navigate("/myActivities");  // Navigate to the updated activity list
                }, 2000);
            })
            .catch((error) => {
                console.error("Error updating activity or fetching activities!", error);
                message.error(
                    `Error updating activity: ${error.response ? error.response.data.message : error.message}`
                );
            });
    };


    return (
        <div
            style={{
                overflow: "visible",
                height: "100vh",
            }}
        >
            <h2 style={{ fontWeight: "bold", textAlign: "center" }}>Edit Itinerary</h2>
            <form
                onSubmit={handleUpdate}
                style={{ marginTop: "20px" }}
                ref={formRef}
            >
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
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
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            style={{ color: "#ff9933" }}
                            checked={formData.isOpen}
                            onChange={handleCheckboxChange}
                            name="isOpen"
                        />
                    }
                    label="Is open"
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Discount"
                    name="specialDiscount"
                    value={formData.specialDiscount}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    type="number"
                />
                <TextField
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    type="datetime-local"
                />
                <TextField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
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
                <TextField
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" className="blackhover">
                    Update Activity
                </Button>
            </form>
        </div>
    )
}

export default EditActivity;
