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
import NotificationsIcon from "@mui/icons-material/Notifications";
import useUserRole from "../getRole";
import Swal from "sweetalert2";

// productCard component
export default function ProductCard({ product,
  showArchive,
  showUnarchive,
  productID,
  showEditProduct,
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
  showPurchase}) {
  const navigate = useNavigate();
  const role = useUserRole();
  const [notified,setNotified] = useState(false);
  const [productInCart, setProductInCart] = useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showWishlist, setShowWishlist] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  React.useEffect(() => {
    setImage(
      `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
    );
  }, []);
  const checkIfInWishlist = async () =>{
    try {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;
      // console.log(userName);

      // Call the backend to check cart
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/myWishlist/${userName}`
      );
      if(!response.data[0]){
        return;
      }
      // Check if the product ID exists in the cart data
      const wishlistProducts = response.data[0].products || [];
      const isProductInWishlist = wishlistProducts.some(
        (wishlistItem) => wishlistItem._id === product._id
      );
      // console.log(isProductInCart);

      // Update the state
      setShowWishlist(isProductInWishlist);
    } catch (error) {
      console.error("Error checking product in wishlist:", error);
      message.error("Failed to check product in wishlist.");
    }
  }
  const checkIfInCart = async () => {
    try {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;
      // console.log(userName);

      // Call the backend to check cart
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/myCart/${userName}`
      );
      // console.log(response.data);
      if(!response.data.cart){
        return;
      }
      // Check if the product ID exists in the cart data
      const cartProducts = response.data.cart.products || [];
      const isProductInCart = cartProducts.some(
        (cartItem) => cartItem.product._id === product._id
      );
      // console.log(isProductInCart);

      // Update the state
      setProductInCart(isProductInCart);
    } catch (error) {
      console.error("Error checking product in cart:", error);
      message.error("Failed to check product in cart.");
    }
  };

  useEffect(() => {
    checkIfInCart();
    checkIfInWishlist();
  }, [product._id]);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

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


  const handleEditProduct =() =>{
    const productId = product._id;
    navigate(`/editProduct/${productId}`);
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
          setProductInCart(!productInCart);
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
          setProductInCart(!productInCart);
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

  const [archived, setArchived] = useState(product.isArchived);


  const TheCard = () => {
    return (
      <div
        style={{
          width: "100%",
          minWidth: "300px",
          minHeight: "375px",
          height: "100%",
        }}
      >
        <Card
          onClick={handleOpen}
          className="product-card"
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
            filter:
            archived || product.availableQuantity === 0
              ? "grayscale(100%)"
              : "none",
          opacity: archived || product.availableQuantity === 0 ? 0.6 : 1,
       
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
                  value={product.averageRating}
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
              {role==="Admin" || showEditProduct &&(
              <Button
                size="md"
                variant="solid"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation(); // Stops propagation
                  handleEditProduct(); // Call the function without passing `event`
                }}
                sx={{ backgroundColor: "#ff9933", marginRight: 1 }}
              >
                Edit Product
              </Button>
              )}
              {product.availableQuantity === 0 && (
                <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -180%)", // Center the text horizontally and vertically
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Add a semi-transparent background
                  color: "black",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  zIndex: 2, // Ensure it appears above other content
                }}
                >
                  Sold Out
                </div>
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
