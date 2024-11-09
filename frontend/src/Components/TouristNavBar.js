import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";

function TouristNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [image, setImage] = React.useState("");
  const [storedPicture, setStoredPicture] = React.useState(localStorage.getItem('profilePicture'));
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  //call the getImage in a useEffect
  const userName = JSON.parse(localStorage.getItem("user")).username;
  React.useEffect(() => {
    const storedPicture = localStorage.getItem('profilePicture');
    getImage(userName);
    // console.log("image", image);
  })
  const getImage = async (userName) => {
    const res = await axios.get(`http://localhost:8000/touristRoutes/getLevel/${userName}`);
    // console.log("level",res.data);
    if (res.data === 1) {
      setImage("level1.png");
    }
    else if (res.data === 2) {
      setImage("level2.png");
    }

    else if (res.data === 3) {
      setImage("level3.png");
    }
  }
  
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

  const [showPreferences, setShowPreferences] = React.useState(false);

  const handleTogglePreferences = () => {
    setShowPreferences((prev) => !prev);
    localStorage.setItem("showPreferences", !showPreferences);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#FFD700", width: "100%" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Tooltip title="Badge">
            <img
              src={image}
              alt="Avatar"
              style={{ width: 70, height: 70, borderRadius: "50%", marginRight: 10 }}
            />
          </Tooltip>
          <Tooltip title="Ducksplorer Home Page">
            <TravelExploreIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Ducksplorer
            </Typography>
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
            <Tooltip title="Book Activities">
              <IconButton onClick={() => handleNavigation("activity/sortFilter")}>
                <FestivalIcon />
                <Typography textAlign="center" marginRight={3}>
                  Activities
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Book Itineraries">
              <IconButton onClick={() => handleNavigation("viewUpcomingItinerary")}>
                <TempleBuddhistIcon />
                <Typography textAlign="center" marginRight={1}>
                  Itineraries
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Book Flights">
              <IconButton onClick={() => handleNavigation("flights")}>
                <FlightIcon />
                <Typography textAlign="center" marginRight={1}>
                  Flights
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Book Hotels">
              <IconButton onClick={() => handleNavigation("hotels")}>
                <HotelIcon />
                <Typography textAlign="center" marginRight={1}>
                  Hotels
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Book Transportation">
              <IconButton onClick={() => handleNavigation("transportation")}>
                <DirectionsCarIcon />
                <Typography textAlign="center" marginRight={1}>
                  Transportation
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="View Products">
              <IconButton
                onClick={() => handleNavigation("TouristAllProducts")}
              >
                <StorefrontIcon />
                <Typography textAlign="center" marginRight={1}>
                  Products
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="View My Bookings">
              <IconButton onClick={() => handleNavigation("mybookings")}>
                <BookmarkAddedIcon />
                <Typography textAlign="center" marginRight={1}>
                  My Bookings
                </Typography>
              </IconButton>
            </Tooltip>

          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 4, width: 40, height: 40 }}
              >
                <img
                  src={storedPicture || "duckAvatar.png"}  // Check if profilePicture exists, else use default
                  alt="Avatar"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
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
              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/editAccount"
                  sx={{ textAlign: "center", p: 0.5 }}
                >
                  <AccountCircleIcon sx={{ fontSize: 20, color: "blue" }} />
                  <Typography sx={{ ml: 1 }} variant="body2">
                    Profile
                  </Typography>
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component="a"
                  href="/login"
                  sx={{ textAlign: "center", p: 0.5 }}
                >
                  <LockIcon sx={{ fontSize: 20, color: "gold" }} />
                  <Typography sx={{ ml: 1 }} variant="body2">
                    Logout
                  </Typography>
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleTogglePreferences}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  {showPreferences ? (
                    <VisibilityIcon sx={{ fontSize: 20, color: "green" }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: 20, color: "red" }} />
                  )}
                  <Typography sx={{ ml: 1 }} variant="body2">
                    Show Preferences
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
