import { React, useState, useEffect } from "react";
import CurrencyConvertor from "../CurrencyConvertor";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  TextField,
} from "@mui/material";
import useUserRole from "../getRole";
import { message } from "antd";
import axios from "axios";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const ProductCard = ({
  product,
  showArchive,
  showUnarchive,
  productID,
  showRating,
  showReview,
}) => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
  const role = useUserRole();
  const [archived, setArchived] = useState(product.isArchived);
  const [rating, setRating] = useState(product.rating || 0);
  const [review, setReview] = useState("");
  const [showReviewBox, setShowReviewBox] = useState(false);

  useEffect(() => {
    setArchived(product.isArchived);
  }, [product.isArchived]);

  useEffect(() => {
    // Fetch the product's rating for this buyer on component mount
    const fetchRating = async () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;

      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/getRating/${productID}/rating/${userName}`
        );

        if (response.status === 200 && response.data.rating !== undefined) {
          setRating(response.data.rating); // Set the buyer's rating from the database
        }
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };

    fetchRating();
  }, [productID]);

  const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
  const user = JSON.parse(userJson);
  const userName = user.username;

  const handleRatingChange = async (event, newValue) => {
    setRating(newValue);
    console.log("i have been clicked");
    try {
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/updateProducts/${productID}`,
        {
          buyer: userName,
          rating: newValue,
        }
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

  const handleAddReview = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/addReview/${productID}`,
        {
          buyer: userName,
          review: review,
        }
      );
      if (response.status === 200) {
        message.success("Review added successfully");
        setShowReviewBox(false);
      } else {
        message.error("Failed to submit review");
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
        <Typography variant="body1">
          Price <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />:
          {(product.price * (exchangeRates[currency] || 1)).toFixed(2)}{" "}
          {currency}
        </Typography>
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
        {/* <Typography variant="body1">
          Ratings:{" "}
          {product.ratings.length > 0
            ? product.ratings.join(", ")
            : "No ratings yet"}
        </Typography> */}
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
        {role === "Tourist" && showRating && (
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
        {role === "Tourist" && showReview && (
          <Button
            variant="contained"
            color="primary"
            style={{ position: "absolute", right: "10px", bottom: "10px" }}
            onClick={() => setShowReviewBox(!showReviewBox)}
          >
            {showReviewBox ? "Cancel" : "Add Review"}
          </Button>
        )}
        {showReviewBox && (
          <div>
            <TextField
              label="Write your review"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <Button
              onClick={handleAddReview}
              variant="contained"
              color="primary"
            >
              Submit Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
