import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Popover from "@mui/material/Popover";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Add from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import Done from "@mui/icons-material/Done";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Rating, Tooltip, Box } from "@mui/material";
import Button from "@mui/joy/Button";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCardDetails from "../productCardDetailed";
import { useState, useEffect } from "react";
import Favorite from "@mui/icons-material/Favorite";

import Swal from "sweetalert2";

// productCard component
export default function ProductCard({ product,
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
  hideWishlist = true,
  showPurchase, showNotify }) {
  const navigate = useNavigate();
  const [productInCart, setProductInCArt] = useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showWishlist, setShowWishlist] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBooking = async (productId) => {
    try {
      const userJson = localStorage.getItem("user");
      const isGuest = localStorage.getItem("guest") === "true";
      if (isGuest) {
        message.error("User is not logged in, Please login or sign up.");
        navigate("/guestDashboard");
        return;
      }
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }

      const type = "product";

      localStorage.setItem("productId", productId);
      localStorage.setItem("type", type);

      const response = await axios.get(
        `http://localhost:8000/touristRoutes/viewDesiredproduct/${productId}`
      );

      if (response.status === 200) {
        if (response.data.isUpcoming) {
          navigate("/payment");
        } else {
          message.error("You can't book an old product");
        }
      } else {
        message.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };

  React.useEffect(() => {
    setImage(
      `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
    );
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  const handleSaveproduct = async (event, productId, currentIsSaved) => {
    event.stopPropagation();
    try {
      const newIsSaved = !currentIsSaved;

      const response = await axios.put(
        `http://localhost:8000/product/save/${productId}`,
        {
          username: username,
          save: newIsSaved,
        }
      );
      if (response.status === 200) {
        setSaveStates((prevState) => ({
          ...prevState,
          [productId]: newIsSaved, // Update the save state for this product
        }));
        message.success(
          newIsSaved
            ? "product saved successfully!"
            : "product removed from saved list!"
        );
        // if (!newIsSaved && onRemove) {
          // onRemove(productId);
        // }
      } else {
        message.error("Failed to save");
      }
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  const [saveStates, setSaveStates] = useState({});

  useEffect(() => {
    const fetchSaveStates = async () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;

      try {
        const response = await axios.get(
          `http://localhost:8000/product/getSave/${product._id}/${userName}`
        );

        if (response.status === 200) {
          setSaveStates((prevState) => ({
            ...prevState,
            [product._id]: response.data.saved, // Update only the relevant product state
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch save state for ${product._id}:`, error);
      }
    };
    fetchSaveStates();
  }, [product._id]);

  const [notificationStates, setNotificationStates] = useState({});

  const requestNotification = async (event, productId, currentIsNotified) => {
    event.stopPropagation();
    try {
      const newIsNotified = !currentIsNotified;

      const response = await axios.post(
        "http://localhost:8000/notification/request",
        {
          user: username,
          eventId: productId,
        }
      );

      if (response.status === 201) {
        message.success(
          newIsNotified
            ? "Notifications enabled for this product!"
            : "Notifications disabled for this product!"
        );
        setNotificationStates((prev) => ({
          ...prev,
          [productId]: newIsNotified,
        }));
        message.success(
          "You will be notified when this event starts accepting bookings."
        );
      } else if (response.status === 200) {
        message.info(
          "You have already requested to be notified for this product"
        );
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error requesting notification:", error);
      message.error("Failed to request notification.");
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
        setShowWishlist(true);
      } else {
        message.error("Failed to add the product to the wishlist.");
      }
    } catch (error) {
      message.error(
        "An error occurred while adding the product to the wishlist."
      );
    }
  };

  const handleAddToCartClick =async (e) => {
    if(!productInCart){
      try{
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;
        // const newQuantity = quantity;
        // Send the selected quantity and product details to the backend
        const response = await axios.put(
          "http://localhost:8000/touristRoutes/cart",
          {
            userName,
            productId: product._id,
            // newQuantity,
          }
        );
  
        if (response.status === 200) {
          message.success("Product added to cart successfully!");
          setProductInCArt(!productInCart);
        } else {
          message.error("Failed to add product to cart.");
        }
      }catch(error){
        console.error(error);
        message.error("An error occurred while adding the product to the cart.");
      }
    }else{
      try{
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;
        // const newQuantity = quantity;
        // Send the selected quantity and product details to the backend
        const response = await axios.delete(
          `http://localhost:8000/touristRoutes/cart`, 
          {
            params: {
              userName: userName, // Your user name
              productId: product._id, // The product ID
            }
          }
        );
  
        if (response.status === 200) {
          message.success("Product removed from successfully!");
          setProductInCArt(!productInCart);
        } else {
          message.error("Failed to remove product to cart.");
        }
      }catch(error){
        console.error(error);
        message.error("An error occurred while removing the product from the cart.");
      }
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
        setShowWishlist(false);
      } else {
        message.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while removing the product");
    }
  };




  const handleShareLink = (productId) => {
    const link = `${window.location.origin}/product/searchActivities/${productId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (productId) => {
    const link = `${window.location.origin}/product/searchActivities/${productId}`; // Update with your actual route
    const subject = "Check out this product";
    const body = `Here is the link to the product: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleClick = (event, productId) => {
    event.stopPropagation();
    // setAnchorEl(event.currentTarget);
    Swal.fire({
      title: "Share product",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <button id="share-link" style="padding: 10px 20px; font-size: 16px; background-color: #ff9933; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Share via Link
          </button>
          <Button className="blackhover" id="share-mail" style="padding: 10px 20px; font-size: 16px; background-color: #ff9933; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Share via Mail
          </Button>
        </div>
      `,
      showConfirmButton: false, // Hide default OK button
      width: "400px", // Set the width of the popup
      padding: "20px", // Add padding to the popup
      customClass: {
        popup: "my-swal-popup", // Optional: Add custom styling via CSS
      },
    });
  };

  const TheCard = () => {
    return (
      <div style={{ width: "100%", minWidth: "300px", minHeight: "375px" }}>
        <Card
          onClick={handleOpen}
          className="product-card"
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={product.picture || image} loading="lazy" alt="" />
            </AspectRatio>
            {!hideWishlist && (
            <Tooltip title="Add to Wishlist">
              <IconButton
                size="md"
                variant={showWishlist ? "soft" : "solid"}
                onClick={(event) => {
                  event.stopPropagation(); // Stop event propagation
                  showWishlist
                    ? handleRemoveWishlist(product)
                    : addToWishlist(product);
                }}
                className="blackhover"
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  color: "white",
                  borderRadius: "50%",
                  right: "1rem",
                  bottom: 0,
                  transform: "translateY(50%)",
                  transition: "transform 0.3s",
                  backgroundColor: "#ff9933",
                }}
              >
                {showWishlist ? (
                  <Done color="#ff9933" />
                ) : (
                  <Favorite />
                )}
              </IconButton>
            </Tooltip>
            )}
            {showNotify && (
              <Tooltip title="Request Notifications">
                <IconButton
                  size="md"
                  variant="solid"
                  color="primary"
                  onClick={(event) =>
                    requestNotification(
                      event,
                      product._id,
                      notificationStates[product._id]
                    )
                  }
                  sx={{
                    borderRadius: "50%",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center  ",
                    alignItems: "center",
                    bottom: 0,
                    transform: "translateY(50%) translateX(-260%)",
                    transition: "transform 0.3s",
                    backgroundColor: "#ffcc00",
                  }}
                ></IconButton>
              </Tooltip>
            )}
          </CardOverflow>
          <div style={{ height: "10%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h4
                  style={{
                    fontWeight: "bold",
                    margin: 0,
                    marginRight: 20,
                  }}
                >
                  {product.name}
                </h4>

                <Rating
                  value={product.rating}
                  icon={<StarIcon sx={{ color: "orange" }} />}
                  emptyIcon={<StarOutlineIcon />}
                  readOnly
                  precision={0.5}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 10,
                width: "95%",
              }}
            >
              <Typography
                level="title-lg"
                sx={{
                  mt: 1,
                  fontSize: 25,
                  maxWidth: "30%",
                  fontWeight: "xl",
                }}
              >
                {product.price}$
              </Typography>
              {showAddToCart &&(
              <Button
                size="md"
                variant="solid"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation(); // Stops propagation
                  handleAddToCartClick(); // Call the function without passing `event`
                }}
                sx={{ backgroundColor: "#ff9933", marginRight: 1 }}
              >
                {productInCart ? "Remove from Cart" : "Add to Cart"}
              </Button>
              )}
            </div>
          </div>
        </Card>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Popover
            open={open}
            anchorEl={null}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            sx={{
              "& .MuiPopover-paper": {
                height: "100vh",
                background: "none",
                boxShadow: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              },
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "60vw",
                maxWidth: "90%",
                maxHeight: "80vh",
                overflow: "auto",
                borderRadius: "16px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#333",
                }}
              >
                &times;
              </button>

              <ProductCardDetails product={product} />
            </div>
          </Popover>
        </div>
      </div>
    );
  };
  return <TheCard />;
}
