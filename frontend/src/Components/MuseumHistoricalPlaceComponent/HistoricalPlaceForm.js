import React, { useState, useEffect } from "react";
import { message, Select } from "antd";
import Input from "@mui/joy/Input"; // Import Input from MUI
import Button from "@mui/joy/Button"; // Import Button from MUI
import Typography from "@mui/material/Typography";

function HistoricalPlaceForm() {
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState(""); // Changed to a string for URL Input
  const [location, setLocation] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [ticketPrices, setTicketPrices] = useState("");
  const [HistoricalPlaceDate, setHistoricalPlaceDate] = useState("");
  const [HistoricalPlaceName, setHistoricalPlaceName] = useState("");
  const [HistoricalPlaceCategory, setHistoricalPlaceCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [historicalPlaceTagsOptions, setHistoricalPlaceTagsOptions] = useState([]);

  // Fetch tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags"
        );
        const data = await response.json();
        setHistoricalPlaceTagsOptions(data); // Store the fetched tags
      } catch (error) {
        console.error("Error fetching historical place tags:", error);
        message.error("Failed to load historical place tags.");
      }
    };

    fetchTags();
  }, []);

  // Responsible for taking the data Inputted in the form and sending to the method of the backend which will create a new historical place
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;

    // Prepare the data to be sent as JSON
    const historicalPlaceData = {
      description,
      pictures, // This now sends an array of URLs
      location,
      openingTime,
      closingTime,
      ticketPrices: ticketPrices.split(",").map(Number), // Convert to array of numbers if needed
      HistoricalPlaceDate, // Make sure to use the correct variable
      HistoricalPlaceName, // Ensure variable is correctly referenced
      HistoricalPlaceCategory, // Ensure variable is correctly referenced
      tags,
      createdBy: userName,
    };

    const response = await fetch(
      "http://localhost:8000/historicalPlace/addHistoricalPlace",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(historicalPlaceData), // Convert object to JSON string
      }
    );

    if (response.ok) {
      const json = await response.json();
      message.success("Historical place added successfully!"); // Success message
      console.log("New historical place added:", json);
      // Reset form fields if necessary
    } else {
      const error = await response.json();
      message.error(
        error.message || "There was an error adding the historical place!"
      ); // Error message
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography variant="h3" style={styles.welcomeText}>
            Add a new historical place
          </Typography>
          <Typography variant="h5" style={styles.descriptionText}>
            Fill in the details to add a new historical place to the database.
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <div style={{ width: "50vw" }}>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "60px", marginTop: "40px" }}
              class="bigTitle"
            >
              Add a Historical Place
            </Typography>
            <form
              className="create"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: "20px" }}
            >
              <Input
                placeholder="Historical Place Description"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Pictures (URL)"
                type="text"
                onChange={(e) => setPictures(e.target.value)}
                value={pictures}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Location"
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Opening Time"
                type="number"
                onChange={(e) => setOpeningTime(e.target.value)}
                value={openingTime}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Closing Time"
                type="number"
                onChange={(e) => setClosingTime(e.target.value)}
                value={closingTime}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Ticket Prices"
                type="number"
                onChange={(e) => setTicketPrices(e.target.value)}
                value={ticketPrices}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Visit Date"
                type="date"
                onChange={(e) => setHistoricalPlaceDate(e.target.value)}
                value={HistoricalPlaceDate}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Name"
                type="text"
                onChange={(e) => setHistoricalPlaceName(e.target.value)}
                value={HistoricalPlaceName}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Historical Place Category"
                type="text"
                onChange={(e) => setHistoricalPlaceCategory(e.target.value)}
                value={HistoricalPlaceCategory}
                required
                sx={{ width: "80%" }}
              />
              <Select
                mode="multiple"
                allowClear
                style={{ width: "80%" }}
                placeholder="Select Historical Place tags"
                value={tags}
                onChange={(selectedTags) => setTags(selectedTags)} // Update tags state
              >
                {historicalPlaceTagsOptions.map((tag) => (
                  <Select.Option key={tag._id} value={tag.historicalPlaceTag}>
                    {tag.historicalPlaceTag}
                  </Select.Option>
                ))}
              </Select>
              <Button
                style={{ mt: 3, backgroundColor: "#ff9933", width: "80%" }}
                type="submit"
              >
                Add a Historical Place
              </Button>
              {error && <div className="error">{error}</div>}
            </form>
          </div>
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
    background: 'url("/duckHistorical.jpg") no-repeat left center fixed',
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
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default HistoricalPlaceForm;
