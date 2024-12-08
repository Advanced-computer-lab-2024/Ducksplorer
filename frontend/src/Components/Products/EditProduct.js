import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Stack, Box, Typography } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import UploadFile from "../ProductUploadImage";
import TouristNavBar from "../TouristNavBar";
import useUserRole from "../getRole";
import AdminNavBar from "../NavBars/AdminNavBar";
import SellerNavBar from "../NavBars/SellerNavBar";

let picture = "";

const EditProduct = () => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [URL, setURL] = useState("");
  const [description, setDescription] = useState("");
  const role = useUserRole();

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

    return (
      <Box
  sx={{
    height: "auto",
    backgroundColor: "#f4f6f9", // Light grey background
    marginTop:"50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
  }}
>
  {role === "Admin" ? <AdminNavBar/> : <SellerNavBar/>} 
  <div
    style={{
      backgroundImage: "url(../../public/Images/bg-intro-desktop.png)", // Ensure this path is correct
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Stack
      spacing={3}
      sx={{
        width: "60vw",  // Responsive width
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly more opaque white
        borderRadius: "15px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        transition: "transform 0.2s ease-in-out",
        '&:hover': {
          transform: "scale(1.02)", // Slight zoom on hover
        },
      }}
    >
      <Typography
        variant="h4"
        className="bigTitle"
        sx={{
          textAlign: "center",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        Edit Product
      </Typography>

      <TextField
        name="name"
        label="Product Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        }}
      />
      <TextField
        name="price"
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        }}
      />
      <TextField
        name="available quantity"
        label="Available Quantity"
        type="number"
        value={availableQuantity}
        onChange={(e) => setAvailableQuantity(e.target.value)}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <img
          name="picture"
          alt="Product"
          src={picture || "../../public/Images/placeholder.png"} // Fallback placeholder image
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            borderRadius: "10px",
          }}
        />
      </div>

      <UploadFile onUpload={handleUpload} />

      <TextField
        name="description"
        label="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleEdit}
        className="blackhover"
        sx={{
          marginTop: "10px",
          padding: "10px",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#007bff",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
      >
        Save Changes
      </Button>
    </Stack>
  </div>
</Box>

  );
}  

export default EditProduct;
