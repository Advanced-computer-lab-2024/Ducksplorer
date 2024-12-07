import React, { useState, useEffect } from "react";
import { message, Select } from "antd";
import Input from "@mui/joy/Input"; // Import Input from MUI
import Button from "@mui/joy/Button"; // Import Button from MUI
import Typography from "@mui/material/Typography";

function MuseumForm() {
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState(""); // Change to a string for URL Input
  const [location, setLocation] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [ticketPrices, setTicketPrices] = useState("");
  const [museumDate, setMuseumDate] = useState("");
  const [museumName, setMuseumName] = useState("");
  const [museumCategory, setMuseumCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [museumTagsOptions, setMuseumTagsOptions] = useState([]); // State to store fetched museum tags

  // Fetch museum tags from the backend
  useEffect(() => {
    const fetchMuseumTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/museumTags/getAllMuseumTags"
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch museum tags");
        }
        // Store the fetched tags in state
        setMuseumTagsOptions(data);
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchMuseumTags(); // Call the function to fetch tags on component mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    // Prepare the data to be sent as JSON
    const museumData = {
      description,
      pictures, // This now sends an array of URLs
      location,
      openingTime,
      closingTime,
      ticketPrices: ticketPrices.split(",").map(Number), // Convert to array of numbers if needed
      museumDate,
      museumName,
      museumCategory,
      tags,
      createdBy: userName,
    };

    const response = await fetch("http://localhost:8000/museum/addMuseum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(museumData), // Convert object to JSON string
    });

    const json = await response.json();
    if (!response.ok) {
      message.error("There was an error adding the museum!");
    }
    if (response.ok) {
      message.success("Museum added successfully!");
      // Reset form fields
      setDescription("");
      setPictures([]); // Reset to an empty array
      setLocation("");
      setOpeningTime("");
      setClosingTime("");
      setTicketPrices("");
      setMuseumDate("");
      setMuseumName("");
      setMuseumCategory("");
      setTags([]);
      setError(null);
      console.log("New museum added", json);
    }
  };

  const handleTagChange = (value) => {
    setTags(value); // Update selected tags
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Typography variant="h3" style={styles.welcomeText}>
            Add a new museum
          </Typography>
          <Typography variant="h5" style={styles.descriptionText}>
            Fill in the details to add a new museum to the database.
          </Typography>
        </div>
        <div style={styles.rightSection}>
          <div style={{ width: "50vw" }}>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "60px" , marginTop: "40px"}}
               class="bigTitle"
            >
              Add a Museum
            </Typography>
            <form
              className="create"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: "20px" }}
            >
              <Input
                placeholder="Museum Description"
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
                placeholder="Museum Location"
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Museum Opening Time"
                type="number"
                onChange={(e) => setOpeningTime(e.target.value)}
                value={openingTime}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Museum Closing Time"
                type="number"
                onChange={(e) => setClosingTime(e.target.value)}
                value={closingTime}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Museum Ticket Prices"
                type="number"
                onChange={(e) => setTicketPrices(e.target.value)}
                value={ticketPrices}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Museum Visit Date"
                type="date"
                onChange={(e) => setMuseumDate(e.target.value)}
                value={museumDate}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Museum Name"
                type="text"
                onChange={(e) => setMuseumName(e.target.value)}
                value={museumName}
                required
                sx={{ width: "80%" }}
              />
              <Input
                placeholder="Museum Category"
                type="text"
                onChange={(e) => setMuseumCategory(e.target.value)}
                value={museumCategory}
                required
                sx={{ width: "80%" }}
              />
              <Select
                mode="multiple"
                allowClear
                style={{ width: "80%" }}
                placeholder="Select Museum tags"
                value={tags}
                onChange={handleTagChange}
              >
                {museumTagsOptions.map((tag) => (
                  <Select.Option key={tag._id} value={tag.museumTag}>
                    {tag.museumTag}
                  </Select.Option>
                ))}
              </Select>
              <Button
                style={{ mt: 3, backgroundColor: "#ff9933", width: "80%" }}
                type="submit"
              >
                Add a museum
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
    background: 'url("/duckMuseum.jpg") no-repeat left center fixed',
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

export default MuseumForm;
