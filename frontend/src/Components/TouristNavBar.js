import * as React from "react";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Import the shopping cart icon
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FestivalIcon from "@mui/icons-material/Festival";
import HotelIcon from "@mui/icons-material/Hotel";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TempleBuddhistIcon from "@mui/icons-material/TempleBuddhist";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MyNotifications from "./myNotifications";
import Cookies from "js-cookie";
import PersistentDrawerLeft from "./Drawer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReportIcon from "@mui/icons-material/Report";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import MailIcon from '@mui/icons-material/Mail';
import MailLockIcon from '@mui/icons-material/MailLock';
import LogoutIcon from '@mui/icons-material/Logout';
import CurrencyConverterGeneral from "./ThirdParty/CurrencyConverterGeneral";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Import the currency icon
import { useLocation } from "react-router-dom";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const TouristNavBar = ({ onCurrencyChange }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [image, setImage] = React.useState("");
  const [storedPicture, setStoredPicture] = React.useState(
    localStorage.getItem("profilePicture")
  );
  const [currencyAnchorEl, setCurrencyAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hideCurrencyIcon = ["/flights", "/hotels", "/transportation", "/TransportationsPage", "/HotelsPage", "/FlightsPage"].includes(location.pathname);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  //call the getImage in a useEffect
  const userName = JSON.parse(localStorage.getItem("user")).username;

  //get the notifications length periodically

  const handleLogout = () => {
    handleCloseUserMenu();
    axios
      .post("http://localhost:8000/signUp/logout")
      .then((response) => {
        console.log(response.data);
        localStorage.removeItem("user");
        Cookies.remove("jwt");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("There was an error logging out!", error);
      });
  };

  useEffect(() => {
    //const storedPicture = localStorage.getItem('profilePicture');

    axios
      .get(`http://localhost:8000/touristRoutes/getLevel/${userName}`)
      .then((response) => {
        console.log(response.data);
        const level = response.data;
        if (level === 1) {
          setImage("/level1.png");
        } else if (level === 2) {
          setImage("/level2.png");
        } else if (level === 3) {
          setImage("/level3.png");
        }
      })
      .catch((error) => {
        console.log("Error: ", error.message);
        console.error("There was an error fetching the image!", error);
      });
  }, [userName]);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleNavigation = (page) => {
    handleCloseNavMenu();
    window.location.href = `/${page}`;
  };

  const handleCurrencyIconClick = (event) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  const handleCurrencyMenuClose = () => {
    setCurrencyAnchorEl(null);
  };

  const [showPreferences, setShowPreferences] = React.useState(() => {
    const savedPreference = localStorage.getItem("showPreferences");
    return savedPreference !== null ? JSON.parse(savedPreference) : false;
  });
  const handleTogglePreferences = () => {
    setShowPreferences((prev) => !prev);
    localStorage.setItem("showPreferences", !showPreferences);
  };

  const [notifyViaMail, setNotifyViaMail] = React.useState(() => {
    const savedNotify = localStorage.getItem("notifyViaMail");
    return savedNotify !== null ? JSON.parse(savedNotify) : false;
  });

  const handleToggleNotifyViaMail =async () => {
    setNotifyViaMail((prev) => !prev);
    localStorage.setItem("notifyViaMail", !notifyViaMail);
    try {
      const response = await axios.post("http://localhost:8000/toggle-cron");
      console.log("Cron job state toggled:", response.data);
    } catch (error) {
      console.error("Error toggling cron state:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        width: "100vw",
        height: "10vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container sx={{ width: "100%" }}>
        <Toolbar disableGutters sx={{ width: "100vw", justifySelf: "center" }}>
          <Tooltip title="Home">
            <a href="/touristDashboard" style={{ textDecoration: "none" }}>
              <h2
                className="duckTitle"
                style={{
                  marginLeft: "20px",
                  fontSize: "40px",
                  fontWeight: "700",
                  color: "orange",
                  fontSize: "2rem",
                }}
              >
                Ducksplorer
              </h2>
            </a>
          </Tooltip>
          {/* <PersistentDrawerLeft /> */}
          {/* <Tooltip title="Ducksplorer Home Page">
          <TravelExploreIcon
            sx={{
              display: { xs: "none", md: "flex" },
              ml: "auto",  // This pushes it to the right in a flex container
              mr: 1,
            }}
          />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate("/touristDashboard")}
              sx={{
                ml: 11,  // Increase the margin-left value to move the text further to the right
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Ducksplorer
            </Typography>

          </Tooltip> */}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <MenuItem onClick={() => handleNavigation("myCart")}>
                  <IconButton>
                    <ShoppingCartIcon />
                  </IconButton>
                  <Typography textAlign="center">Cart</Typography>
                </MenuItem> */}
                <MenuItem onClick={() => handleNavigation("activities")}>
                  <IconButton>
                    <FestivalIcon />
                  </IconButton>
                  <Typography textAlign="center">Activities</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("itineraries")}>
                  <IconButton>
                    <TempleBuddhistIcon />
                  </IconButton>
                  <Typography textAlign="center">Itineraries</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("flights")}>
                  <IconButton>
                    <FlightIcon />
                  </IconButton>
                  <Typography textAlign="center">Flights</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("hotels")}>
                  <IconButton>
                    <HotelIcon />
                  </IconButton>
                  <Typography textAlign="center">Hotels</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("transportation")}>
                  <IconButton>
                    <DirectionsCarIcon />
                  </IconButton>
                  <Typography textAlign="center">Transportation</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("products")}>
                  <IconButton>
                    <DirectionsCarIcon />
                  </IconButton>
                  <Typography textAlign="center">Products</Typography>
                </MenuItem>
              </Box>
            </Menu>
          </Box>
          <TravelExploreIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              "&:hover": {
                color: "#ff9933",
              },
            }}
          >
            Bookings
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Tooltip title="My Cart">
              <IconButton
                onClick={() => handleNavigation("myCart")}
              >
                <ShoppingCartIcon />
                <Typography textAlign="center" marginRight={3}>
                  Cart
                </Typography>
              </IconButton>
            </Tooltip> */}
            <Button
              className="nav-item"
              onClick={() => handleNavigation("activity/searchActivities")}
              sx={{
                fontSize: "1rem",
                fontFamily: "'Josefin Sans', sans-serif",
                color: "black",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Lobster', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Activities
              </Typography>
            </Button>
            <Button
              className="nav-item"
              onClick={() => handleNavigation("viewAllTourist")}
              sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                color: "black",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Itineraries
              </Typography>
            </Button>
            <Button
              className="nav-item"
              onClick={() => handleNavigation("flights")}
              sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                color: "black",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Flights
              </Typography>
            </Button>
            <Button
              className="nav-item"
              onClick={() => handleNavigation("hotels")}
              sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                color: "black",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Hotels
              </Typography>
            </Button>
            <Button
              className="nav-item"
              onClick={() => handleNavigation("transportation")}
              sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                color: "black",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Transportation
              </Typography>
            </Button>

            <Button
              className="nav-item"
              onClick={() => handleNavigation("MuseumTouristPov")}
              sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Landmarks
              </Typography>
            </Button>

            <Button
              className="nav-item"
              onClick={() => handleNavigation("TouristAllProducts")}
              sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                textAlign: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FEF4EA",
                },
              }}
            >
              <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "black",
                  "&:hover": {
                    color: "#ff9933",
                  },
                }}
              >
                Marketplace
              </Typography>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0, marginRight: "3vw " }}>
            <Tooltip>
              <MyNotifications />
            </Tooltip>
            <Tooltip>
              <IconButton onClick={() => handleNavigation("wishlist")}>
                <FavoriteBorderIcon
                  sx={{
                    color: "black",
                    "&:hover": {
                      color: "#ff9933",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip>
              <IconButton onClick={() => handleNavigation("myCart")}>
                <ShoppingCartIcon
                  sx={{
                    color: "black",
                    "&:hover": {
                      color: "#ff9933",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            {!hideCurrencyIcon && (
              <>
                <Tooltip title="Currency Converter">
                  <IconButton onClick={handleCurrencyIconClick}>
                    <AttachMoneyIcon sx={{ color: "black" }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={currencyAnchorEl}
                  open={Boolean(currencyAnchorEl)}
                  onClose={handleCurrencyMenuClose}
                >
                  <CurrencyConverterGeneral onCurrencyChange={onCurrencyChange} initialCurrency="USD" />
                </Menu>
              </>
            )}
            <Tooltip title="Open Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 4, width: 40, height: 40 }}
              >
                <img
                  src={image} // Fallback to a default image if image is undefined
                  alt="Avatar"
                  style={{
                    maxWidth: "60px", // Use consistent units
                    maxHeight: "60px",
                    borderRadius: "100%", // Circular shape
                    border: "2px solid #FFD700", // Add a gold border for a premium feel
                  }}
                  // Fallback in case of image load error
                  title="User Avatar" // Tooltip for accessibility
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleTogglePreferences}>
                <IconButton
                  sx={{ textAlign: "center", p: 0.5, color: "black" }}
                >
                  {showPreferences ? (
                    <VisibilityIcon sx={{ fontSize: 20, color: "green" }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: 20, color: "red" }} />
                  )}
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Show Preferences
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/editAccount"
                  sx={{ textAlign: "center", p: 0.5, color: "black" }}
                >
                  <AccountCircleIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Profile
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/mySaved"
                  sx={{ textAlign: "center", p: 0.5 }}
                >
                  <BookmarksIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Saved
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/mybookings"
                  sx={{ textAlign: "center", p: 0.5 }}
                >
                  <BookmarkAddedIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    My Bookings
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/orders"
                  sx={{ textAlign: "center", p: 0.5 }}
                >
                  <StorefrontIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    My Orders
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/myComplaints"
                  sx={{ textAlign: "center", p: 0.5 }}
                >
                  <ReportIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    My Complaints
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <IconButton component="a" sx={{ textAlign: "center", p: 0.5 }}>
                  <LogoutIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Logout
                  </Typography>
                </IconButton>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TouristNavBar;
