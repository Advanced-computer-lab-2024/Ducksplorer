import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Popover from "@mui/material/Popover";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
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
import Input from "@mui/joy/Input";
import Favorite from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useUserRole from "../getRole";
import Swal from "sweetalert2";

// productCard component
export default function ProductCard({
  product,
  showArchive,
  showUnarchive,
  productID,
  showEditProduct=false,
  showRating, //shows the user review , also for myPurchases as a tourist
  showReview,
  inCartQuantity,
  isConfirmButtonVisible = false,
  showAddToCart = false,
  onProductRemove,
  onQuantityChange,
  showQuantity = false,
  showRemoveWishlist,
  showAverageRatingNo, //shows/hides the average rating to users , for hiding when viewing in myPurchases Page as a tourist
  removeProductFromWishlist,
  hideWishlist = true,
  showPurchase,
  inCart,
  showNotify,
  onConfirm,
  quantityInCart = 0,
}) {
  const navigate = useNavigate();
  const role = useUserRole();
  const [notified, setNotified] = useState(false);
  const [productInCart, setProductInCart] = useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showWishList, setShowWishList] = useState(false);
  const [archived, setArchived] = useState(product.isArchived);
  const [quantity, setQuantity] = useState(quantityInCart);
  const [open, setOpen] = React.useState(false);
  const isGuest = localStorage.getItem("guest") === "true";
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmClick = () => {
    onConfirm();
  };

  React.useEffect(() => {
    setImage(
`https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`);
  }, []);
  const checkIfInWishlist = async () => {
    try {

      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;
      // console.log(userName);

      // Call the backend to check cart
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/myWishlist/${userName}`
      );
      if (!response.data[0]) {
        return;
      }
      // Check if the product ID exists in the cart data
      const wishlistProducts = response.data[0].products || [];
      const isProductInWishlist = wishlistProducts.some(
        (wishlistItem) => wishlistItem._id === product._id
      );
      // console.log(isProductInCart);

      // Update the state
      setShowWishList(isProductInWishlist);
    } catch (error) {
      console.error("Error checking product in wishlist:", error);
      message.error("Failed to check product in wishlist.");
    }
  };
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
      if (!response.data.cart) {
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
    if(!isGuest){
    checkIfInCart();
    checkIfInWishlist();}
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
        setShowWishList(true);
      } else {
        message.error("Failed to add the product to the wishlist.");
      }
    } catch (error) {
      message.error(
        "An error occurred while adding the product to the wishlist."
      );
    }
  };

  const handleEditProduct = () => {
    const productId = product._id;
    navigate(`/editProduct/${productId}`);
  };

  const handleAddToCartClick = async (e) => {
    if (quantity > 0) {
      try {
        if (isGuest) {
          message.error("Can't purchase a product as a guest, Please login or sign up.");
          return;
        }
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;
        const newQuantity = quantity;
        console.log("this is the quantity i am requesting", newQuantity);
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
          setProductInCart(!productInCart);
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
          message.success("Product removed from successfully!");
          setProductInCart(!productInCart);
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
  };

  const handleAddToCartClick2 = async (e) => {
    if (quantity > 0) {
      try {
        const userJson = localStorage.getItem("user");
        const user = JSON.parse(userJson);
        const userName = user.username;
        const newQuantity = quantity;
        console.log("this is the quantity i am requesting", newQuantity);
        const response = await axios.patch(
          "http://localhost:8000/touristRoutes/cart",
          {
            userName,
            productId: product._id,
            newQuantity,
          }
        );
        if (response.status === 200) {
          message.success("Product added to cart successfully!");
          setProductInCart(!productInCart);
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
          message.success("Product removed from successfully!");
          setProductInCart(!productInCart);
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
`http://localhost:8000/touristRoutes/removeFromWishlist/${userName}/${productId}`);
      setShowWishList(false);

      if (response.status === 200) {
        message.success("Product removed from wishlist successfully");
        removeProductFromWishlist(product._id);
        return response.data;
      } else {
        message.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            filter: archived ? "grayscale(100%)" : "none",
            opacity: archived ? 0.6 : 1,
          }}
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={product.picture || image} loading="lazy" alt="" />
            </AspectRatio>
            {role === "Tourist" && !hideWishlist && (
              <Tooltip
                title={
                  showRemoveWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <IconButton
                  size="md"
                  variant={showWishList ? "soft" : "solid"}
                  onClick={(event) => {
                    event.stopPropagation(); // Stop event propagation
                    showWishList
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
                  {showWishList ? <Done color="#ff9933" /> : <Favorite />}
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
          {product.availableQuantity > 0 &&
            role === "Tourist" &&
            showQuantity &&
            (inCart || !productInCart) && (
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  bottom: "15%",
                  width: "95%",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    marginRight: 8,
                    display: "flex",
                    width: quantity < 10 ? "111px" : "140px",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      quantity > 0 ? setQuantity(quantity - 1) : setQuantity(0);
                    }}
                    sx={{
                      borderColor: "#ff9933",
                      color: "#ff9933",
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      width: "33%",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    -
                  </Button>
                  <Input
                    value={quantity}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    sx={{
                      width: "50px",
                      borderRight: 0,
                      borderLeft: 0,
                      borderRadius: 0,
                      boxShadow: "none",
                      width: "33%",
                    }}
                  ></Input>
                  <Button
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      product.availableQuantity > quantity
                        ? setQuantity(quantity + 1)
                        : message.error(
                            "Cannot purchase with a quantity more than the available"
                          );
                    }}
                    sx={{
                      borderColor: "#ff9933",
                      color: "#ff9933",
                      borderTopLeftRadius: 0,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                      borderBottomLeftRadius: 0,
                      width: "33%",
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

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

            {showAddToCart && (
              <Button
                size="md"
                variant="solid"
                className={product.availableQuantity > 0 ? "blackhover" : ""}
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation(); // Stops propagation
                  if (product.availableQuantity > 0) {
                    handleAddToCartClick(); // Call the function without passing event
                  }
                }}
                sx={{
                  backgroundColor:
                    product.availableQuantity !== 0 ? "#ff9933" : "gray",
                  marginRight: 1,
                  clickable: product.availableQuantity > 0,
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                }}
              >
                {productInCart
                  ? "Remove from Cart"
                  : product.availableQuantity === 0
                  ? "Sold Out"
                  : "Add To Cart"}
              </Button>
            )}

            {inCart && (
              <Button
                size="md"
                variant="solid"
                className={product.availableQuantity > 0 ? "blackhover" : ""}
                zIndex={2}
                onClick={async (event) => {
                  event.stopPropagation(); // Stops propagation
                  if (product.availableQuantity > 0) {
                    await handleAddToCartClick2(); // Call the function without passing event
                    handleConfirmClick();
                  }
                }}
                sx={{
                  backgroundColor:
                    product.availableQuantity !== 0 ? "#ff9933" : "gray",
                  marginRight: 1,
                  width: "111px",
                  clickable: product.availableQuantity > 0,
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                }}
              >
                Confirm
              </Button>
            )}
            {
              (showEditProduct && (
                <Button
                  size="md"
                  variant="solid"
                  className="blackhover"
                  zIndex={2}
                  onClick={(event) => {
                    event.stopPropagation(); // Stops propagation
                    handleEditProduct(); // Call the function without passing event
                  }}
                  sx={{ backgroundColor: "#ff9933", marginRight: 1 }}
                >
                  Edit Product
                </Button>
              ))}
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