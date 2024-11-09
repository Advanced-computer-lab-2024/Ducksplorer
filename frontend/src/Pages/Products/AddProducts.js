// src/Components/AllProducts.js
import React, { useState, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import { TextField, Button, Stack } from "@mui/material";
import UploadFile from "../../Components/ProductUploadImage";
import Help from "../../Components/HelpIcon.js";

let picture = "";

function AddProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [description, setDescription] = useState("");
  // const [picture, setPicture] = useState("");
  const [URL, setURL] = useState("");
  const fileInputRef = useRef(null); // Use a ref to access the file input

  const handleAddProduct = async () => {
    try {
      const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
      const user = JSON.parse(userJson);
      const userName = user.username;
      const seller = userName;
      console.log("URL:", typeof URL);
      console.log("picture", picture);
      const response = await axios.post(
        "http://localhost:8000/adminRoutes/createProducts",
        {
          name,
          price,
          ratings: [],
          availableQuantity,
          picture,
          description,
          seller,
          reviews: [],
        }
      );
      if (response.status === 200) {
        console.log("i am posting", response.data);
        console.log(picture);
        message.success("product added successfully");
      } else {
        message.error("failed to add admin");
      }
    } catch (error) {
      message.error("an error occured: " + error.message);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleUpload = (url) => {
    setURL(url);
    picture = url;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Add Product</h2>
      <Button onClick={handleBackClick}>Back</Button>
      <Stack spacing={2}>
        <TextField
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Available Quantity"
          type="number"
          value={availableQuantity}
          onChange={(e) => setAvailableQuantity(e.target.value)}
          variant="outlined"
          fullWidth
        />
        {/* <TextField
          label="Picture URL"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
          variant="outlined"
          fullWidth
        /> */}
        {/* <form>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            onChange={() => {
              const file = fileInputRef.current.files[0];
              setPicture(file);
            }}
          />
        </form> */}

        <UploadFile onUpload={handleUpload} />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct} // Call function to handle adding the product here
          style={{ marginTop: "10px" }}
        >
          Add Product
        </Button>
      </Stack>
      <Help />
    </div>
  );
}

export default AddProducts;
