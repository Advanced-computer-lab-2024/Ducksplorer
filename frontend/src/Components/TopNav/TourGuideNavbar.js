import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

function TourGuideNavbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showPreferences, setShowPreferences] = React.useState(() => {
    const savedPreference = localStorage.getItem("showPreferences");
    return savedPreference !== null ? JSON.parse(savedPreference) : false;
  });
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleTogglePreferences = () => {
    setShowPreferences((prev) => !prev);
    localStorage.setItem("showPreferences", !showPreferences);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#d4ebf8",
        width: "100%",
        height: "9vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Add your navigation items here */}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: 4, width: 40, height: 40 }}
              >
                <AccountCircleIcon />
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

export default TourGuideNavbar;
