import { React, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from "@mui/material";
import useUserRole from "../getRole";
import { message } from "antd";
import axios from "axios";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const ProductCard = ({ product, showArchive, showUnarchive, productID }) => {
  const role = useUserRole();
  const [archived, setArchived] = useState(product.isArchived);
  const [rating, setRating] = useState(product.rating || 0);

  useEffect(() => {
    setArchived(product.isArchived);
  }, [product.isArchived]);

  const handleRatingChange = async (event, newValue) => {
    setRating(newValue);
    console.log("i have been clicked");
    try {
      console.log(newValue);
      console.log("product", product);
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/updateProducts/${productID}`,
        { rating: newValue }
      );
      if (response.status === 200) {
        message.success("Rating updated successfully");
      } else {
        message.error("Failed to submit rating");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchive = async () => {
    const data = { isArchived: true };
    try {
      const response = await axios.put(
        `http://localhost:8000/sellerRoutes/editProduct/${product._id}`,
        data
      );
      if (response.status === 200) {
        message.success("Product Archived");
        setArchived(true);
      } else {
        message.error("Failed to edit products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const handleUnarchive = async () => {
    const data = { isArchived: false };
    try {
      const response = await axios.put(
        `http://localhost:8000/sellerRoutes/editProduct/${product._id}`,
        data
      );
      if (response.status === 200) {
        message.success("Product Unarchived");
        setArchived(false);
      } else {
        message.error("Failed to edit products");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  return (
    <Card
      style={{
        marginBottom: "20px",
        maxWidth: "500px",
        position: "relative",
        filter: archived ? "grayscale(100%)" : "none", // Greyscale effect when archived
        opacity: archived ? 0.6 : 1,
      }}
    >
      <CardMedia
        component="img"
        height="400" // Adjust the height as needed
        image={product.picture}
        alt={product.name}
        style={{ objectFit: "cover" }} // Ensure the image covers the container
      />
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body1">Price: ${product.price}</Typography>
        <Typography variant="body1">
          Available Quantity: {product.availableQuantity}
        </Typography>
        {(role === "Admin" || role === "Seller") && (
          <Typography variant="body1">Sales: {product.sales}</Typography>
        )}
        <Typography variant="body1">
          Description: {product.description}
        </Typography>
        <Typography variant="body1">Seller: {product.seller}</Typography>
        <Typography variant="body1">
          Ratings:{" "}
          {product.ratings.length > 0
            ? product.ratings.join(", ")
            : "No ratings yet"}
        </Typography>
        <h4>Reviews:</h4>
        {Object.entries(product.reviews).length > 0 ? (
          Object.entries(product.reviews).map(([user, review]) => (
            <div key={user}>
              <Typography variant="body2">User: {user}</Typography>
              <Typography variant="body2">Rating: {review.rating}</Typography>
              <Typography variant="body2">Comment: {review.comment}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="body2">No reviews available.</Typography>
        )}
        {(role === "Admin" || role === "Seller") &&
          showArchive &&
          !archived && <Button onClick={handleArchive}> Archive </Button>}
        {archived && showUnarchive && (
          <Button onClick={handleUnarchive}> Unarchive </Button>
        )}
        {role === "Tourist" && (
          <div key={product._id}>
            <Rating
              value={rating}
              onChange={handleRatingChange}
              icon={<StarIcon sx={{ color: "orange" }} />}
              emptyIcon={<StarOutlineIcon />}
              readOnly={false}
              precision={0.5}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
