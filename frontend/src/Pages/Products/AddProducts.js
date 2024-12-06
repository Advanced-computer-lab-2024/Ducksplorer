// src/Components/AllProducts.js
import React, { useState, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import { Paper, Stack } from "@mui/material";
import { Button, Input } from "@mui/joy";
import UploadFile from "../../Components/ProductUploadImage";

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
    <div
      style={{
        width: "40vw",
        minWidth: "600px",

        height: "auto",
      }}
    >
      <Paper sx={{ height: "100%", padding: "50px", borderRadius: "30px" }}>
        <div style={{ marginBottom: "40px" }}>
          <Button
            onClick={handleBackClick}
            sx={{ marginBottom: "10px", width: "100px" }}
            className="blackhover"
          >
            Back
          </Button>
          <h2
            className="bigTitle"
            style={{
              textAlign: "center",

              alignSelf: "center",
            }}
          >
            Add Product
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            columnGap: "30px",
            rowGap: "20px",
          }}
        >
          <Input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            size="lg"
          />
          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            variant="outlined"
            size="lg"
          />
          <Input
            placeholder="Available Quantity"
            type="number"
            value={availableQuantity}
            onChange={(e) => setAvailableQuantity(e.target.value)}
            variant="outlined"
            size="lg"
          />
          {/* <Inputd
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

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            multiline
            size="lg"
            rows={4}
          />
          <UploadFile onUpload={handleUpload} />

          <Button
            className="blackhover"
            color="primary"
            onClick={handleAddProduct} // Call function to handle adding the product here
            style={{ marginTop: "10px" }}
            size="lg"
          >
            Add Product
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default AddProducts;
