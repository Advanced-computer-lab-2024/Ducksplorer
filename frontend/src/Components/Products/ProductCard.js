import { React, useState, useEffect } from "react";
import CurrencyConvertor from "../CurrencyConvertor";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import useUserRole from "../getRole";
import { message } from "antd";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { calculateProductRating } from "../../Utilities/averageRating";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  showArchive,
  showUnarchive,
  productID,
  showRating, //shows the user review , also for myPurchases as a tourist
  showReview,
  inCartQuantity,
  isConfirmButtonVisible = false,
  showAddToCart = false,
  onProductRemove,
  onQuantityChange,
  showRemoveWishlist,
  showAverageRatingNo, //shows/hides the average rating to users , for hiding when viewing in myPurchases Page as a tourist
  removeProductFromWishlist,
  hideWishlist,
  showPurchase,
}) => {
  const [isFormVisible, setFormVisible] = useState(false); // Controls form visibility
  const [quantity, setQuantity] = useState(1); // Holds the selected quantity
  const [neededQuantity, setNeededQuantity] = useState(inCartQuantity || 1);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const location = useLocation();
  const isGuest = localStorage.getItem("guest") === "true";
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  useEffect(() => {
    if (inCartQuantity !== undefined) {
      setNeededQuantity(inCartQuantity);
    }
  }, [inCartQuantity]);

  useEffect(() => {
    const fetchPurchaseStatus = async () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const username = user.username;

      try {
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/myPurchases/${username}`
        );
        console.log(response.data);
        if (response.status === 200) {
          setPurchaseStatus(response.data[0].status);
        } else {
          setPurchaseStatus("Not Purchased");
        }
      } catch (error) {
        console.error("Failed to fetch purchase status:", error);
        setPurchaseStatus("Error fetching status");
      }
    };
    fetchPurchaseStatus();
  }, [product._id]);

  const handleCartConfirmQuantity = async (e) => {
    e.preventDefault();
    console.log(neededQuantity);
    if (neededQuantity > 0) {
      try {
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;
        const newQuantity = neededQuantity;
        const response = await axios.patch(
          "http://localhost:8000/touristRoutes/cart",
          {
            userName,
            productId: product._id,
            newQuantity,
          }
        );
        if (response.status === 200) {
          message.success("Product quantity updated successfully!");
        } else {
          message.error("Failed to update quantity in cart.");
        }
      } catch (error) {
        console.error(error);
        message.error(
          "An error occurred while adding the product to the cart."
        );
      }
    } else {
      try {
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;
        const response = await axios.delete(
          "http://localhost:8000/touristRoutes/cart",
          {
            params: {
              userName,
              productId: product._id,
            },
          }
        );
        if (response.status === 200) {
          message.success("Product removed successfully!");
          onProductRemove(product._id);
        } else {
          message.error("Failed to update quantity in cart.");
        }
      } catch (error) {
        console.error(error);
        message.error(
          "An error occurred while adding the product to the cart."
        );
      }
    }
    onQuantityChange(product._id, neededQuantity); // Notify the parent
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;
      const newQuantity = quantity;
      // Send the selected quantity and product details to the backend
      const response = await axios.put(
        "http://localhost:8000/touristRoutes/cart",
        {
          userName,
          productId: product._id,
          newQuantity,
        }
      );

      if (response.status === 200) {
        message.success("Product added to cart successfully!");
        setFormVisible(false); // Hide the form after submission
      } else {
        message.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while adding the product to the cart.");
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1); // Increment the quantity by 1
    if (quantity >= product.availableQuantity) {
      message.error("Cannot purchase with a quantity more than the available");
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Decrement the quantity but not below 1
    if (quantity > product.availableQuantity + 1) {
      message.error("Cannot purchase with a quantity more than the available");
    }
  };

  const handleDecrementForCart = () => {
    setNeededQuantity((prev) => (prev > 0 ? prev - 1 : 0)); // Decrement the quantity but not below 0
  };

  const handleIncrementForCart = () => {
    setNeededQuantity((prev) => prev + 1); // Increment the quantity by 1
  };

  const handleAddToCartClick = () => {
    setFormVisible(true); // Show the form when the button is clicked
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };
  const role = useUserRole();
  const [archived, setArchived] = useState(product.isArchived);
  const [rating, setRating] = useState(product.rating || 0);
  const [review, setReview] = useState("");
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const navigate = useNavigate();

  const getReviewerRating = (reviewer) => {
    const ratingEntry = product.ratings.find(
      (rating) => rating.buyer === reviewer
    );
    return ratingEntry ? ratingEntry.rating : "No rating available";
  };

  useEffect(() => {
    setArchived(product.isArchived);
  }, [product.isArchived]);

  useEffect(() => {
    if (location.pathname === "/myPurchases") {
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
    }
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

  const handleRemoveWishlist = async (product) => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;
    console.log("product:", product._id);
    const productId = product._id;
    console.log("username:", userName);
    try {
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/removeFromWishlist/${userName}/${productId}`
      );

      if (response.status === 200) {
        message.success("Product removed from wishlist successfully");
        removeProductFromWishlist(product._id);
        return response.data;
      } else {
        message.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while removing the product");
    }
  };

  const addToWishlist = async (product) => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;
    try {
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/updateWishlist/${userName}`,
        {
          products: [product],
        }
      );
      if (response.status === 200) {
        message.success("Product added to wishlist successfully!");
        setShowWishlist(false);
      } else {
        message.error("Failed to add the product to the wishlist.");
      }
    } catch (error) {
      message.error(
        "An error occurred while adding the product to the wishlist."
      );
    }
  };
  const handlePurchase = async (product) => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;
    try {
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/updatePurchases/${userName}`,
        {
          products: [product],
        }
      );
      if (response.status === 200) {
        message.success("Product purchased successfully!");
      } else {
        message.error("Failed to purchase product.");
      }
    } catch (error) {
      message.error("An error occurred while purchasing the product.");
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
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        margin: "16px",
        width: "100%",
        maxWidth: "300px",
        height: "70vh",
        filter:
          archived || product.availableQuantity === 0
            ? "grayscale(100%)"
            : "none",
        opacity: archived || product.availableQuantity === 0 ? 0.6 : 1,
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={product.picture}
        alt={product.name}
        style={{ objectFit: "cover" }}
      />
      <div style={{ overflow: "auto", height: "40%" }}>
        <CardContent>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {product.name}
          </Typography>
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
          {!showAverageRatingNo && (
            <Rating
              value={calculateProductRating(product.ratings)}
              precision={0.1}
              readOnly
            />
          )}
          <h4>Reviews:</h4>
          {Object.entries(product.reviews).length > 0 ? (
            Object.entries(product.reviews).map(([user, review]) => (
              <div key={user}>
                <Typography variant="body2">User: {review.buyer}</Typography>
                <Typography variant="body2">
                  Rating: {getReviewerRating(review.buyer)}
                </Typography>
                <Typography variant="body2">
                  Comment: {review.review}
                </Typography>
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
          <div>
            {role === "Tourist" && showPurchase && (
              <Typography variant="body1">Status: {purchaseStatus}</Typography>
            )}

            {product.availableQuantity === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Sold Out
              </div>
            )}
          </div>
          {!isGuest && showAddToCart && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddToCartClick}
              style={{ position: "relative", left: "75%" }} // Place the button at the bottom-right corner
            >
              Add To Cart
            </Button>
          )}
          {isConfirmButtonVisible && (
            <form
              onSubmit={handleCartConfirmQuantity}
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Quantity Selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDecrementForCart}
                  style={{ minWidth: "40px", minHeight: "40px" }}
                >
                  -
                </Button>
                <Typography variant="h6">{neededQuantity}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleIncrementForCart}
                  style={{ minWidth: "40px", minHeight: "40px" }}
                >
                  +
                </Button>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: "80%" }}
              >
                Confirm
              </Button>
            </form>
          )}
          {isFormVisible && (
            <form
              onSubmit={handleFormSubmit}
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Quantity Selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDecrement}
                  style={{ minWidth: "40px", minHeight: "40px" }}
                >
                  -
                </Button>
                <Typography variant="h6">{quantity}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleIncrement}
                  style={{ minWidth: "40px", minHeight: "40px" }}
                >
                  +
                </Button>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: "80%" }}
              >
                Confirm
              </Button>
            </form>
          )}
          <div>
            {role === "Tourist" && !hideWishlist && (
              <Button
                variant="contained"
                color="primary"
                style={{ position: "relative", left: "75%", bottom: "100%" }} // Place the button at the bottom-right corner
                onClick={() =>
                  showRemoveWishlist
                    ? handleRemoveWishlist(product)
                    : addToWishlist(product)
                }
              >
                {showRemoveWishlist
                  ? "remove from wishlist"
                  : "Add to Wishlist"}
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProductCard;
