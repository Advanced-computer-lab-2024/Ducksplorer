import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import StandAloneToggleButton from "../../Components/ToggleButton.js";

import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
} from "@mui/material";
import AdvertiserNavBar from "../../Components/TopNav/AdvertiserNavbar";
import { Select } from "antd";  // Import Select component

function EditHistoricalPlace() {
    const historicalPlace = JSON.parse(localStorage.getItem("selectedHistoricalPlace"));
    let allTags = JSON.parse(localStorage.getItem("HistoricalTags"));
    const { state } = useLocation();
    const navigate = useNavigate();
    const museum = JSON.parse(localStorage.getItem("selectedMuseum"));
    const formRef = useRef(null); // For auto-scrolling
    const selectedTags = historicalPlace.tags;
    // Form state
    const [formData, setFormData] = useState({
        description: historicalPlace.description || "",
        location: historicalPlace.location || "",
        pictures: historicalPlace.pictures || "",
        ticketPrices: historicalPlace.ticketPrices || "",
        openingTime: historicalPlace.openingTime || "",
        closingTime: historicalPlace.closingTime || "",
        historicalDate: historicalPlace.HistoricalPlaceDate 
            ? new Date(historicalPlace.HistoricalPlaceDate).toISOString().slice(0, 16) 
            : "",
        HistoricalPlaceName: historicalPlace.HistoricalPlaceName || "",
        HistoricalPlaceCategory: historicalPlace.HistoricalPlaceCategory || "",
        tags: historicalPlace.tags || [],
    });
    

    // Scroll to form on edit
    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };    
       

    // Handle tag selection
    const handleTagChange = (tag) => {
        setFormData((prevData) => {
            const updatedTags = prevData.tags.includes(tag)
                ? prevData.tags.filter((t) => t !== tag) // Remove the tag
                : [...prevData.tags, tag]; // Add the tag
            return { ...prevData, tags: updatedTags };
        });
    };    

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
      };

    // Update the museum details
 // Update the museum details
 const handleUpdate = (event) => {
    event.preventDefault();

    const payload = {
        ...formData,
        tags: formData.tags.map((tag) => tag.trim()), // Ensure no accidental whitespace
    };

    console.log("Payload to update:", payload); // Debugging

    axios
        .put(
            `http://localhost:8000/historicalPlace/updateHistoricalPlace/${historicalPlace._id}`,
            payload
        )
        .then((response) => {
            console.log("Update response:", response.data); // Debugging
            localStorage.setItem(
                "selectedHistoricalPlace",
                JSON.stringify(response.data)
            );
            message.success("Historical Place updated successfully!");
            navigate("/RUDHistoricalPlace");
        })
        .catch((error) => {
            console.error("Update failed:", error);
            message.error("Error updating Historical Place!");
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
                            style={{ fontWeight: "bold", textAlign: "center" }}>Edit Historical Place</h2>
                        <Box />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
                                <TextField
                                    label="Name"
                                    name="HistoricalPlaceName"
                                    value={formData.HistoricalPlaceName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                    label="Category"
                                    name="HistoricalPlaceCategory"
                                    value={formData.HistoricalPlaceCategory}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField     
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                id="location"
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                id="pictures"
                                    label="Picture"
                                    name="pictures"
                                    value={formData.pictures}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                id="ticketPrices"
                                    label="Ticket Price"
                                    name="ticketPrices"
                                    value={formData.ticketPrices}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                id="HistoricalMuseumDate"
                                    name="historicalMuseumDate"
                                    type="datetime-local"
                                    value={formData.historicalDate}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />

                                <TextField
                                id="openingTime"
                                    label="Opening Time"
                                    name="openingTime"
                                    value={formData.openingTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                id="closingTime"
                                    label="Closing Time"
                                    name="closingTime"
                                    value={formData.closingTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    required
                                />
                                
                                {/* Tags dropdown */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
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
                                    {allTags.map((element) => {
                                        return (
                                            <StandAloneToggleButton
                                                key={element._id}
                                                name={element.name}
                                                tags={formData.tags}
                                                selected={formData.tags.includes(element.name)} // Correct comparison here
                                                onChange={() => handleTagChange(element.name)} // Pass the tag name
                                            />
                                        );
                                    })}
                                </div>
                                <Box sx={{ mt: 2 }}>
                                    <Button type="submit" variant="contained" className="blackhover" onClick={handleUpdate}>
                                        Update
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
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default EditHistoricalPlace;