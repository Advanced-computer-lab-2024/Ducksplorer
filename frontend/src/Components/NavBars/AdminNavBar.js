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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import ReportIcon from "@mui/icons-material/Report";
import LabelIcon from "@mui/icons-material/Label";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WidgetsIcon from "@mui/icons-material/Widgets";
import MyNotifications from "../myNotifications";

function AdminNavBar() {
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
            <a href="/adminDashboard" style={{ textDecoration: "none" }}>
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
              <MenuItem onClick={() => handleNavigation("changePassword")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <LockIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Change Password
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("pendingusers")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Approve Pending Users
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("deleteusers")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <DeleteIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Delete Users
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("addAdmin")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <PersonAddIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Add Admin
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("addGovernor")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <PersonAddIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Add Governor
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("categoriesActions")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <CategoryIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Categories
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("admin/complaints")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <ReportIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Complaints
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("preferenceTags")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <LabelIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Tags
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("Adminproducts")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <ShoppingCartIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Products Management
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("ViewAllActivities")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <WidgetsIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    View all Activities
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("ViewAllItineraries")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <EventNoteIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    View All Itineraries
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("adminReport")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <EventNoteIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Revenue Report
                  </Typography>
                </IconButton>
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("userReport")}>
                <IconButton sx={{ textAlign: "center", p: 0.5 }}>
                  <EventNoteIcon sx={{ fontSize: 20, color: "black" }} />
                  <Typography
                    textAlign="center"
                    marginLeft={2}
                    sx={{ color: "black", fontSize: "14px" }}
                  >
                    Users Report
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

export default AdminNavBar;
