import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function AdvertiserNavBar() {
  const image = "duckAvatar.png";
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (page) => {
    handleCloseUserMenu();
    navigate(`/${page}`);
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

  const handleDeleteAccount = async () => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (userName) {
      try {
        const response = await axios.delete(`http://localhost:8000/advertiserAccount/deleteMyAdvertiserAccount/${userName}`);
        alert(response.data.message);
        navigate('/login');
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
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
            <a href="/advertiserDashboard" style={{ textDecoration: "none" }}>
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
          
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0, marginRight: "3vw", display: "flex", alignItems: "center" }}>
            <Tooltip title="Open Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 4, width: 40, height: 40 }}
              >
                <img
                  src={image}
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
              <MenuItem onClick={() => handleNavigation("advertiserEditAccount")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <PersonIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Edit Account
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("activity/addActivity")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <AddIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Add Activity
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("activity/myActivities")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    My Activities
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("advertiserReport")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <SummarizeIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Report
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={handleDeleteAccount}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <DeleteIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Delete My Account
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

export default AdvertiserNavBar;
