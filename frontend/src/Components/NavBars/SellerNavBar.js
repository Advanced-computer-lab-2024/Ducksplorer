import * as React from "react";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MyNotifications from "../myNotifications";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import Cookies from "js-cookie";

function SellerNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
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
    navigate(`/${page}`);
  };

  const handleDeleteAccount = async () => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user?.username || "";
    if (userName) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/sellerAccount/deleteMySellerAccount/${userName}`
        );
        alert(response.data.message);
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

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
            <a href="/sellerDashboard" style={{ textDecoration: "none" }}>
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
          
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              className="nav-item"
              onClick={() => handleNavigation("ProductDashboard")}
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
                Manage Products
              </Typography>
            </Button>
            <Button
              className="nav-item"
              onClick={() => handleNavigation("sellerReport")}
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
                Report
              </Typography>
            </Button>
          </Box>
          
          <Box sx={{ flexGrow: 0, marginRight: "3vw", display: "flex", alignItems: "center" }}>
            <Tooltip>
              <MyNotifications />
            </Tooltip>
            <Tooltip title="Open Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 4, width: 40, height: 40 }}
              >
                <img
                  src={"duckavatar.png"}
                  alt="Avatar"
                  style={{
                    maxWidth: "50px",
                    maxHeight: "50px",
                    borderRadius: "100%",
                    border: "2px solid #FFD700",
                  }}
                  title="User Avatar"
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
              <MenuItem onClick={() => handleNavigation("sellerEditAccount")}>
                <IconButton
                  sx={{ textAlign: "center", p: 0.5, color: "black" }}
                >
                  <PersonIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Edit Profile
                  </Typography>
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <LockIcon sx={{ fontSize: 20, color: "black" }} />
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

export default SellerNavBar;
