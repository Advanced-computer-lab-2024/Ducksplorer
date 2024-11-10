import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Stack } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import { get } from "mongoose";
import UploadFile from "../ProductUploadImage";

let picture = "";

const EditProduct = () => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [URL, setURL] = useState("");
  const [description, setDescription] = useState("");

  const getPreviousData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/sellerRoutes/product/${productId}`
      );
      if (response.status === 200) {
        console.log(productId);
        const product = response.data;
        console.log(product);
        setName(product.name);
        setPrice(product.price);
        setAvailableQuantity(product.availableQuantity);
        picture = product.picture;
        setDescription(product.description);
        console.log("product:", product);
        console.log("name:", name);
      } else {
        message.error("Failed to get product");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    getPreviousData();
  }, []);

  const handleUpload = (url) => {
    setURL(url);
    picture = url;
  };

  const handleEdit = async () => {
    const data = {};
    if (name !== "") data.name = name;
    if (price !== "") data.price = price;
    if (availableQuantity !== "") data.availableQuantity = availableQuantity;
    if (picture !== "") data.picture = picture;
    if (description !== "") data.description = description;

    try {
      console.log("data: ", data);
      const response = await axios.put(
        `http://localhost:8000/sellerRoutes/editProduct/${productId}`,
        data
      );
      if (response.status === 200) {
        message.success("Product edited");
      } else {
        message.error("Failed to edit products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div
      style={{
        backgroundImage: "url(../../public/Images/bg-intro-desktop.png)", // Update with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        justifyContent: "center",
        overflowY: "visible",
        alignItems: "center",
      }}
    >
      <Button onClick={handleBackButtonClick}>Back</Button>

      <Stack
        spacing={1}
        sx={{
          width: "600px",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
          overflowY: "visible",
        }}
      >
        <div className="trial-btn text-white cursor-pointer">
          <span className="text-bold"></span>
        </div>
        <TextField
          name="name"
          label="product"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="price"
          label="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          name="available quantity"
          label="available quantity"
          type="number"
          value={availableQuantity}
          onChange={(e) => setAvailableQuantity(e.target.value)}
        />
        <div style={{ borderRadius: "3cap" }}>
          <img
            name="picture"
            label="picture"
            type="text"
            src={picture}
            style={{
              maxWidth: "500px",
              borderRadius: "3cap",
            }}
          />
        </div>
        <UploadFile onUpload={handleUpload} />
        <TextField
          name="desription"
          label="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit} // Call function to handle adding the product here
          style={{ marginTop: "10px" }}
        >
          Save
        </Button>
      </Stack>
    </div>
  );
};

export default EditProduct;
