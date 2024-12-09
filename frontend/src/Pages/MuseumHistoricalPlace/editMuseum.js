import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import StandAloneToggleButton from "../../Components/MuseumHistoricalPlaceComponent/TagsToggleButtons";
import GovernorNavBar from "../../Components/NavBars/GovernorNavBar.js";

import { Box, Button, Typography, Paper, TextField } from "@mui/material";

function EditMuseum() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const museum = JSON.parse(localStorage.getItem("selectedMuseum"));
  const formRef = useRef(null);

  console.log("Museum", museum);
  // Form state
  const [formData, setFormData] = useState({
    description: museum.description || "",
    location: museum.location || "",
    pictures: museum.pictures || "",
    ticketPrices: museum.ticketPrices || "",
    openingTime: museum.openingTime || "",
    closingTime: museum.closingTime || "",
    museumDate: museum.museumDate
      ? new Date(museum.museumDate).toISOString().slice(0, 16)
      : "",
    museumName: museum.museumName || "",
    museumCategory: museum.museumCategory || "",
    tags: museum.tags || [],
  });
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/museumTags/getAllMuseumTags"
        );
        const data = response.data;
        const museumTags = data.map((element) => ({
          _id: element._id,
          name: element.museumTag,
        }));
        setAllTags(museumTags);
        localStorage.setItem("MuseumTags", JSON.stringify(museumTags));
      } catch (error) {
        console.error("There was an error fetching the tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Scroll to form on edit
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handle input changes
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
  const handleUpdate = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:8000/museum/updateMuseum/${museum._id}`, formData)
      .then(() => {
        message.success("Museum updated successfully!");
        navigate("/RUDMuseum"); // Redirect back to the RUDMuseum page
      })
      .catch((error) => {
        console.error("Error updating museum:", error);
        message.error("Failed to update the museum!");
      });
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <GovernorNavBar />

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
            <h2
              className="bigTitle"
              style={{ fontWeight: "bold", textAlign: "center" }}
            >
              Edit Museum
            </h2>
            <Box />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
                <TextField
                  label="Museum Name"
                  name="museumName"
                  value={formData.museumName}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Museum Category"
                  name="museumCategory"
                  value={formData.museumCategory}
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
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Picture"
                  name="pictures"
                  value={formData.pictures}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Ticket Price"
                  name="ticketPrices"
                  value={formData.ticketPrices}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Museum Date"
                  name="museumDate"
                  value={formData.museumDate}
                  onChange={handleInputChange}
                  fullWidth
                  type="datetime-local"
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Opening Time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Closing Time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
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
                        tagType={"museum"}
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
                  <Button
                    type="submit"
                    variant="contained"
                    className="blackhover"
                    onClick={handleUpdate}
                  >
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

export default EditMuseum;
