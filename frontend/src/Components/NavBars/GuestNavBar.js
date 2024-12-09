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
import Cookies from "js-cookie";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Report";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Import the currency icon

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CurrencyConverterGeneral from "../ThirdParty/CurrencyConverterGeneral";

function GuestNavBar({ onCurrencyChange }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [image, setImage] = React.useState("");
  const [storedPicture, setStoredPicture] = React.useState(
    localStorage.getItem("profilePicture")
  );
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


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

  const [showPreferences, setShowPreferences] = React.useState(() => {
    const savedPreference = localStorage.getItem("showPreferences");
    return savedPreference !== null ? JSON.parse(savedPreference) : false;
  });
  const handleTogglePreferences = () => {
    setShowPreferences((prev) => !prev);
    localStorage.setItem("showPreferences", !showPreferences);
  };

  const [currencyAnchorEl, setCurrencyAnchorEl] = React.useState(null);

  const handleCurrencyIconClick = (event) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  const handleCurrencyMenuClose = () => {
    setCurrencyAnchorEl(null);
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
            <a href="/guestDashboard" style={{ textDecoration: "none" }}>
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
          <Button
            className="nav-item"
            onClick={() => handleNavigation("login")}
            sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                textAlign: "center",
                textTransform: "none",
                backgroundColor: "#ff9933", // Keep the background color for the login button
                "&:hover": {
                    backgroundColor: "#ff7700",
                  },
            }}
            >
            <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                fontSize: "1rem",
                fontFamily: "'Josefin Sans', sans-serif",
                color: "#FEF4EA", // Text color for Login button
                "&:hover": {
                    color: "#FEF4EA", // Keep the same color on hover
                },
                }}
            >
                Login
            </Typography>
            </Button>

            <Button
            className="nav-item"
            onClick={() => handleNavigation("signUp")}
            sx={{
                fontSize: "1.25rem",
                fontFamily: "'Roboto', sans-serif",
                textAlign: "center",
                textTransform: "none",
                backgroundColor: "transparent", // No background color for the Sign Up button
                color: "#ff9933", // Set the Sign Up text color to #ff9933
                "&:hover": {
                color: "#e68a00", // Change color to a darker shade on hover
                },
            }}
            >
            <Typography
                textAlign="center"
                className="nav-bar-text"
                sx={{
                fontSize: "1rem",
                fontFamily: "'Josefin Sans', sans-serif",
                color: "#ff9933", // Text color for Sign Up button
                "&:hover": {
                    color: "#e68a00", // Slightly darker peach on hover
                },
                }}
            >
                Sign Up
            </Typography>
            </Button>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default GuestNavBar;
