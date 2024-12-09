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
import { Rating, Tooltip, Box, TextField, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, } from "@mui/material";
import Button from "@mui/joy/Button";
import axios from "axios";
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
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
  showEditProduct = false,
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
  showChosenQuantity,
  chosenQuantity,
}) {
  const navigate = useNavigate();
  const role = useUserRole();
  const [notified, setNotified] = useState(false);
  const [productInCart, setProductInCart] = useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [showWishList, setShowWishList] = useState(false);
  const [archived, setArchived] = useState(product.isArchived);
  const [quantity, setQuantity] = useState(quantityInCart);
  const [open, setOpen] = React.useState(false);
  const isGuest = localStorage.getItem("guest") === "true";
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rating, setRating] = useState(null);
  const location = useLocation();
  const [review, setReview] = useState("");
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // To control Popover position
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setArchived(product.isArchived);
  }, [product.isArchived]);

  const getReviewerRating = (reviewer) => {
    const ratingEntry = product.ratings.find(
      (rating) => rating.buyer === reviewer
    );
    return ratingEntry ? ratingEntry.rating : "No rating available";
  };

  useEffect(() => {
    if (location.pathname.startsWith("/myPurchases/")) {
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
  }, [productID, rating, location.pathname]);

  const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
  const user = JSON.parse(userJson);
  const username = user.username;

  const handleRatingChange = async (event, newValue) => {
    setRating(newValue);
    try {
      const response = await axios.put(
        `http://localhost:8000/touristRoutes/updateProducts/${productID}`,
        {
          buyer: username,
          ratingstr: newValue,
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
          buyer: username,
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

  const handleConfirmClick = () => {
    onConfirm();
  };

  React.useEffect(() => {
    setImage(
      `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
    );
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
    if (!isGuest) {
      checkIfInCart();
      checkIfInWishlist();
    }
  }, [product._id]);

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleAddToCartClick = async (e) => {
    if (quantity > 0) {
      try {
        if (isGuest) {
          message.error(
            "Can't purchase a product as a guest, Please login or sign up."
          );
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
        `http://localhost:8000/touristRoutes/removeFromWishlist/${userName}/${productId}`
      );
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
                    showRemoveWishlist
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
                  {showRemoveWishlist ? <Done color="#ff9933" /> : <Favorite />}
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
                {role === "Tourist" && showRating && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div key={product._id} style={{ marginTop: "8%" }}>
                      <p style={{ marginBottom: 0 }}>Rate this product:</p>
                    </div>
                    <div style={{ height: "30px" }}>
                      <Rating
                        value={rating}
                        onChange={handleRatingChange}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        icon={<StarIcon sx={{ color: "orange" }} />}
                        emptyIcon={<StarOutlineIcon />}
                        sx={{ marginTop: 0 }}
                        readOnly={false}
                        precision={0.5}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "3%" }}>
            {role === "Tourist" && showChosenQuantity && (
              <p>Chosen Quantity: {chosenQuantity}</p>
            )}
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
            {showEditProduct && (
              <Button
                size="md"
                variant="solid"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation(); // Stops propagation
                  handleEditProduct(); // Call the function without passing event
                }}
                sx={{ backgroundColor: "#ff9933", marginRight: "-10%" }}
              >
                Edit Product
              </Button>
            )}
            {(role === "Admin" || role === "Seller") &&
              showArchive &&
              !archived && (
                <Button
                  size="md"
                  variant="solid"
                  className="blackhover"
                  zIndex={2}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleArchive();
                  }}
                  sx={{ backgroundColor: "#ff9933", marginRight: "2%" }}
                >
                  Archive
                </Button>
              )}
            {archived && showUnarchive && (
              <Button
                size="md"
                variant="solid"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation();
                  handleUnarchive();
                }}
                sx={{ backgroundColor: "#ff9933", marginRight: "2%" }}
              >
                Unarchive
              </Button>
            )}
            {/* {role === "Tourist" && showReview && (
            <Button
              variant="contained"
              color="primary"
              className="blackhover"
              style={{ position: "absolute", right: "10px", bottom: "10px", color:'white' }}
              onClick={(event) => {
                event.stopPropagation()
                setShowReviewBox(!showReviewBox)
              }}
            >
              {showReviewBox ? "Cancel" : "Add Review"}
            </Button>
          )} */}
            {role === "Tourist" && showReview && (

               <Button
                variant="contained"
                color="primary"
                className="blackhover"
                style={{
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                  color: "white",
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setAnchorEl(event.currentTarget); // Open popover
                  setShowReviewBox(!showReviewBox);
                }}
              >
                {showReviewBox ? "Cancel" : "Add Review"}
              </Button>
            )}

            <Popover
              open={showReviewBox}
              anchorEl={null}
              onClose={(event) => {
                event.stopPropagation();
                setShowReviewBox(false);
              }} // Close when clicking outside
              // onClick={(event) => {
              //   event.stopPropagation();
              // }}
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
                  height: "30vh",
                  boxShadow: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
                },
              }}
            >
              <div
                style={{ padding: "16px", width: "400px", alignSelf: "center" }}
              >
                <TextField
                  label="Write your review"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                  }}
                  // onClick={(e) => {
                  //   e.stopPropagation()
                  // }}
                />
                <div style={{ marginTop: "10px" }}>
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAddReview();
                      setShowReviewBox(false);
                    }}
                    variant="contained"
                    color="primary"
                    className="blackhover"
                    sx={{
                      color:'white'
                    }}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </Popover>
          </div>
        </Card>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
         {!showReviewBox && (<Popover
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

              <ProductCardDetails product={product} role={role} />
            </div>
          </Popover> )}
        </div>
      </div>
    );
  };
  return <TheCard />;
}