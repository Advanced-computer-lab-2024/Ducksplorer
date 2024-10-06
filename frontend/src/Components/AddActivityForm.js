import React, { createContext, useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import CategoriesDropDown from "./CategoryDropDown";
import StandAloneToggleButton from "./ToggleButton";
import AdvertiserSidebar from "./AdvertiserSidebar";

export const TagsContext = createContext();
let tags = [];

const AddActivityForm = () => {
  //   const { type } = useTypeContext();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [specialDiscount, setSpecialDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const allTags = JSON.parse(localStorage.getItem("tags")) || [];

  const data = {
    name,
    isOpen,
    advertiser: JSON.parse(localStorage.getItem("user")).username,
    date,
    location,
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
      !location ||
      !price ||
      !specialDiscount ||
      !duration ||
      !name ||
      !category ||
      tags.length === 0
    ) {
      message.error("All fields are required");
      return false;
    }
    return true;
  };
  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      await axios.post("http://localhost:8000/activity", data);
      message.success("Activity Created Successfully!");
    } catch (error) {
      message.error("An error occurred: " + error.message);
      console.error("There was an error creating activity!", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(../../public/Images/bg-intro-desktop.png)", // Update with your image path
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
          onChange={(e) => {
            setPrice(e.target.value);
          }}
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
            onChange={() => {
              isOpen ? setIsOpen(false) : setIsOpen(true);
            }}
          />
        </div>
        <TextField
          name="specialDiscount"
          label="Discount"
          type="number" // Toggle password visibility
          value={specialDiscount}
          onChange={(e) => setSpecialDiscount(e.target.value)}
        />
        <TextField
          name="date"
          onSelect={() => {
            isClicked = true;
          }}
          label={isClicked ? "Date" : ""} // try this later!
          type={"datetime-local"} // Toggle password visibility
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          name="duration"
          label="Duration"
          type="number" // Toggle password visibility
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            setCategory(localStorage.getItem("category").trim());
          }}
        />
        <TextField
          name="location"
          label="Location"
          type="url" // Toggle password visibility
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <CategoriesDropDown />
        <div
          style={{
            display: "Flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flexBasis: 10,
          }}
        >
          {allTags.map((element) => {
            return (
              <TagsContext.Provider key={element._id} value={tags}>
                <StandAloneToggleButton key={element._id} name={element.name} />
              </TagsContext.Provider>
            );
          })}
        </div>
        <Button
          variant="contained"
          onClick={() => {
            handleAdd();
          }}
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
