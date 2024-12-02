import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material"; // Import IconButton from Material-UI
import LogoutIcon from "@mui/icons-material/Logout"; // Import LogoutIcon from Material-UI Icons


const AdminNavbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [showPreferences, setShowPreferences] = useState(() => {
    const savedPreference = localStorage.getItem("showPreferences");
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  const navigate = useNavigate();

  // Handlers
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleNavigation = (path) => {
    handleCloseUserMenu();
    navigate(`/${path}`);
  };

  const handleTogglePreferences = () => {
    setShowPreferences((prev) => {
      const updatedPreference = !prev;
      localStorage.setItem("showPreferences", JSON.stringify(updatedPreference));
      return updatedPreference;
    });
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#d4ebf8",
        width: "100%",
        height: "9%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between", // Keep site name on the left and profile icon on the right
          alignItems: "center",
        }}
      >
        {/* Left Section: Ducksplorer Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4" // Adjusted to larger font size
            noWrap
            sx={{
              fontWeight: "bold",
              fontFamily: "'Poppins', sans-serif", // Modern font
              letterSpacing: "2px", // Increased spacing
              color: "#004d40",
              cursor: "pointer",
              marginLeft: "20px", // Add some space from the edge
              transition: "color 0.3s ease-in-out", // Smooth hover effect
              "&:hover": {
                textDecoration: "none", // No underline
                color: "#00695c", // Darker green on hover
              },
            }}
            onClick={() => navigate("/admin")}
          >
            Ducksplorer
          </Typography>
        </Box>

        {/* Right Section: Profile Icon */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Open settings">
            <AccountCircleIcon
              sx={{
                fontSize: 50, // Size of the icon
                color: "#004d40", // Icon color
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)", // Scale effect on hover
                  color: "#00695c", // Change color on hover
                },
              }}
              onClick={handleOpenUserMenu}
            />
          </Tooltip>

          {/* User Menu */}
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


            <MenuItem
              onClick={() => handleNavigation("login")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px", // Space between icon and text
                padding: "10px 20px", // Add padding for a larger click area
                borderRadius: "8px", // Rounded corners
                "&:hover": {
                  backgroundColor: "#f44336", // Highlight color on hover
                  color: "white", // Change text color on hover
                },
              }}
            >
              <IconButton
                sx={{
                  color: "#f44336", // Initial icon color
                  "&:hover": {
                    color: "white", // Change icon color on hover
                  },
                }}
              >
                <LogoutIcon /> {/* Replace with a logout icon from Material-UI */}
              </IconButton>
              <Typography
                textAlign="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Logout
              </Typography>
            </MenuItem>

          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
