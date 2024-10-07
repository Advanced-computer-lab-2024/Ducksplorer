import React, { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import CategoriesDropDown from "./CategoryDropDown";
import StandAloneToggleButton from "./ToggleButton";
import AdvertiserSidebar from "./AdvertiserSidebar";
import { useNavigate } from "react-router-dom";

let tags = [];

const AddActivityForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(""); // Location state
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [specialDiscount, setSpecialDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const allTags = JSON.parse(localStorage.getItem("tags")) || [];
  const navigate = useNavigate();

  // Fetch location and form data from localStorage after navigating back
  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation");
    if (storedLocation) {
      setLocation(storedLocation); // Update location state
    }


    // Retrieve form data from localStorage
    const storedFormData = localStorage.getItem("addActivityFormData");
    if (storedFormData) {
      const {
        name: storedName,
        date: storedDate,
        isOpen: storedIsOpen,
        price: storedPrice,
        category: storedCategory,
        specialDiscount: storedDiscount,
        duration: storedDuration,
        tags: storedTags,
      } = JSON.parse(storedFormData);

      setName(storedName || "");
      setDate(storedDate || "");
      setIsOpen(storedIsOpen || false);
      setPrice(storedPrice || "");
      setCategory(storedCategory || "");
      setSpecialDiscount(storedDiscount || "");
      setDuration(storedDuration || "");
      tags = storedTags || [];
    }
  }, []);

  const data = {
    name,
    isOpen,
    advertiser: JSON.parse(localStorage.getItem("user")).username,
    date,
    location, // Use updated location
    price,
    category,
    tags,
    specialDiscount,
    duration,
  };

  let isClicked = null;

  const validateFields = () => {
    if (
      !date ||
      !price ||
      !specialDiscount ||
      !duration ||
      !name ||
      !category 
    ) {
      message.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      localStorage.removeItem("selectedLocation");
      return;
    }

    try {
      await axios.post("http://localhost:8000/activity", data);
      message.success("Activity Created Successfully!");
      localStorage.removeItem("addActivityFormData");
      console.log(tags);
      tags = [];
      console.log(tags);

      // Clear localStorage
      localStorage.removeItem("addActivityFormData");
      localStorage.removeItem("selectedLocation");
    } catch (error) {
      message.error("An error occurred: " + error.message);
      console.error("There was an error creating the activity!", error);
    }
  };

  const handleNavigate = () => {
    // Save all form data in localStorage before navigating
    localStorage.setItem(
      "addActivityFormData",
      JSON.stringify({
        name,
        date,
        isOpen,
        price,
        category,
        specialDiscount,
        duration,
        tags,
      })
    );
    navigate("/location"); // Navigate to /location when button is clicked
  };

  return (
    <div
      style={{
        backgroundImage: "url(../../public/Images/bg-intro-desktop.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AdvertiserSidebar />
      <Stack
        spacing={1}
        sx={{
          width: "600px",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
        }}
      >
        <div className="trial-btn text-white cursor-pointer">
          <span className="text-bold">Add Activity</span>
        </div>
        <TextField
          name="name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div
          id="isOpenDiv"
          style={{
            display: "flex",
            flexDirection: "row",
            border: "1px solid rgba(0,0,0,.2)",
            borderRadius: 5,
            height: 55,
          }}
        >
          <p
            style={{
              color: "rgba(0, 0, 0, 0.6) ",
              marginRight: 488,
              paddingTop: 16,
              paddingLeft: 12,
            }}
          >
            isOpen
          </p>
          <input
            name="isOpen"
            label="isOpen"
            type="checkbox"
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />
        </div>
        <TextField
          name="specialDiscount"
          label="Discount"
          type="number"
          value={specialDiscount}
          onChange={(e) => setSpecialDiscount(e.target.value)}
        />
        <TextField
          name="date"
          onSelect={() => {
            isClicked = true;
          }}
          label={isClicked ? "Date" : ""}
          type={"datetime-local"}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          name="duration"
          label="Duration"
          type="number"
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            setCategory(localStorage.getItem("category").trim());          
          }}
        />
        <TextField
          name="location"
          label="Location"
          type="text"
          value={location} // Location input
          disabled // Make it non-editable, coming from the map
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigate} // Use the handleNavigate function for routing
        >
          Go to Location
        </Button>
        <CategoriesDropDown />
        <div
          style={{
            display: "Flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flexBasis: 10,
          }}
        >
          {console.log(allTags)}
          {allTags.map((element) => {
            console.log(element)
            return (
              <StandAloneToggleButton
                tags={tags}
                key={element._id}
                name={element.name}
              />
            );
          })}
          {/* {console.log(allTags)}; */}
        </div>
        <Button
          variant="contained"
          onClick={handleAdd}
          style={{
            width: "580px",
            backgroundColor: "Green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add Activity
        </Button>
      </Stack>
    </div>
  );
};

export default AddActivityForm;
