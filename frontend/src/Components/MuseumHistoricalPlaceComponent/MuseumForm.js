// This file is a component which we import inside the createMuseum page
import React, { useState, useEffect } from "react";
import { message, Select } from "antd";
import Input from "@mui/joy/Input"; // Import Input from MUI
import Button from "@mui/joy/Button"; // Import Button from MUI

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
  // const [createdBy, setCreatedBy] = useState(''); no longer needed because we have the logged in user
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
    <div style={{ width: "50vw" }}>
      <form
        className="create"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h2
          style={{ textAlign: "center", fontSize: "50px" }}
          className="oswald-Titles"
        >
          Add a new museum
        </h2>
        <label>Museum Description:</label>
        <Input
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />
        <label>Pictures (URL):</label>
        <Input
          type="text"
          onChange={(e) => setPictures(e.target.value)}
          value={pictures}
          required
        />{" "}
        {/* Changed to accept URL */}
        <label>Museum Location:</label>
        <Input
          type="text"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          required
        />
        <label>Museum Opening Time:</label>
        <Input
          type="number"
          onChange={(e) => setOpeningTime(e.target.value)}
          value={openingTime}
          required
        />
        <label>Museum Closing Time:</label>
        <Input
          type="number"
          onChange={(e) => setClosingTime(e.target.value)}
          value={closingTime}
          required
        />
        <label>Museum Ticket Prices:</label>
        <Input
          type="number"
          onChange={(e) => setTicketPrices(e.target.value)}
          value={ticketPrices}
          required
        />
        <label>Museum Visit Date:</label>
        <Input
          type="date"
          onChange={(e) => setMuseumDate(e.target.value)}
          value={museumDate}
          required
        />
        <label>Museum Name:</label>
        <Input
          type="text"
          onChange={(e) => setMuseumName(e.target.value)}
          value={museumName}
          required
        />
        <label>Museum Category:</label>
        <Input
          type="text"
          onChange={(e) => setMuseumCategory(e.target.value)}
          value={museumCategory}
          required
        />
        {/* <label>Tags:</label>
            <Input type="text" onChange={(e) => setTags(e.target.value)} value={tags} /> */}
        <label>Tags:</label>
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
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
        {/* <label>Created By:</label>
            <Input type="text" onChange={(e) => setCreatedBy(e.target.value)} value={createdBy} /> */}
        <Button sx={{ mt: 3 }} type="submit">
          Add a museum
        </Button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default MuseumForm;
