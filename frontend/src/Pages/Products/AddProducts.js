import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Paper, Stack } from "@mui/material";
import { Button, Input } from "@mui/joy";
import UploadFile from "../../Components/ProductUploadImage";
import { Typography } from "@mui/material";
import SellerNavBar from "../../Components/NavBars/SellerNavBar";

let picture = "";

function AddProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [URL, setURL] = useState("");
  const fileInputRef = useRef(null);

  const handleAddProduct = async () => {
    try {
      const userJson = localStorage.getItem("user");
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={{height:"100vh" , overflow: "hidden"}}>
    <SellerNavBar/>
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <Typography variant="h3" className="duckTitle"  style={styles.welcomeText}>
          Add Your Product
        </Typography>
      </div>
      <div style={styles.rightSection}>
        <Paper sx={{ height: "100%" , width:"100%" , paddingTop:"40px" , backgroundColor: "rgba(255,255,255,0.65)"}}>
          <div style={{ marginBottom: "40px" }}>
            {/* <Button
              onClick={handleBackClick}
              sx={{ marginBottom: "10px", width: "100px" }}
              className="blackhover"
            >
              Back
            </Button> */}
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
              sx = {{width:"80%" , alignSelf:"center"}}
              size="lg"
            />
            <Input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx = {{width:"80%" , alignSelf:"center"}}
              variant="outlined"
              size="lg"
            />
            <Input
              placeholder="Available Quantity"
              type="number"
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(e.target.value)}
              variant="outlined"
              sx = {{width:"80%" , alignSelf:"center"}}
              size="lg"
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              multiline
              sx = {{width:"80%" , alignSelf:"center"}}
              size="lg"
              rows={4}
            />
            <div style={{width:"80%" , alignSelf:"center"}}>
            <UploadFile onUpload={handleUpload}  />
            </div>
            <Button
              className="blackhover"
              color="primary"
              onClick={handleAddProduct}
              style={{ marginTop: "10px" , width:"80%" , alignSelf:"center"}}
              size="lg"
            >
              Add Product
            </Button>
          </div>
        </Paper>
      </div>
    </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "120vh",
    width: "100vw",
    background: 'url("/duckProducts.jpg") no-repeat left center fixed',
    backgroundSize: "cover",
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
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
    position: "fixed",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default AddProducts;
