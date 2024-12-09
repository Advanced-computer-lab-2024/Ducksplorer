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
import AdvertiserNavBar from "../../Components/NavBars/AdvertiserNavBar.js"
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
   
    //for scrolling automatically when we click edit
    const formRef = useRef(null);

    useEffect(() => {
        if (activity && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activity]);

    const handleCheckboxChange = (event, tag) => {
        const { checked } = event.target;  // Get the checked state of the checkbox
        setSelectedTags((prevSelectedTags) => {
            if (checked) {
                // Add tag to the selectedTags array if checked
                return [...prevSelectedTags, tag];
            } else {
                // Remove tag from the selectedTags array if unchecked
                return prevSelectedTags.filter((t) => t !== tag);
            }
        });
    };
    

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
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
        <Box
            sx={{
                height: "100vh",
            }}
        >
            <AdvertiserNavBar />

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
                            style={{ fontWeight: "bold", textAlign: "center" }}>Edit Activity</h2>
                        <Box />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                                        checked={formData.isOpen}  // This should reflect the formData state
                                        onChange={handleCheckboxChange}  // This will update formData
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
                                value={formData.date ? formData.date.split('T')[0] + 'T' + formData.date.split('T')[1].substring(0, 5) : ''} // Ensure correct format (YYYY-MM-DDTHH:mm)
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
                                   {allTags.map((element) => (
                                    <FormControlLabel
                                        key={element._id}
                                        control={
                                            <Checkbox
                                                checked={selectedTags.includes(element.name)}  // Check if the tag is selected
                                                onChange={(event) => handleCheckboxChange(event, element.name)}  // Pass both event and tag name
                                                name={element.name}
                                            />
                                        }
                                        label={element.name}
                                    />
                                ))}

                                </div>
                                <Button type="submit" variant="contained" className="blackhover" style={{ marginTop: "5%" }}>
                                    Update Activity
                                </Button>
                                <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleGoBack}
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            marginTop: "3%",
                                        }}
                                        >
                                    Cancel
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default EditActivity;
