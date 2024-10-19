import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FestivalIcon from '@mui/icons-material/Festival';import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TempleBuddhistIcon from '@mui/icons-material/TempleBuddhist';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import LockIcon from '@mui/icons-material/Lock';
//const pages = ['Products', 'Pricing', 'Blog'];
//const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function TouristNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#FFD700', width: '100%' }}> {/* Darker yellow color */}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TravelExploreIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Ducksplorer
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <MenuItem onClick={() => handleNavigation('activities')}>
                <IconButton>
                  <FestivalIcon />
                </IconButton>
                <Typography textAlign="center">Activities</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('itineraries')}>
                <IconButton>
                  <TempleBuddhistIcon />
                </IconButton>
                <Typography textAlign="center">Itineraries</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('flights')}>
                <IconButton>
                  <FlightIcon />
                </IconButton>
                <Typography textAlign="center">Flights</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('hotels')}>
                <IconButton>
                  <HotelIcon />
                </IconButton>
                <Typography textAlign="center">Hotels</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('transportation')}>
                <IconButton>
                  <DirectionsCarIcon />
                </IconButton>
                <Typography textAlign="center">Transportation</Typography>
              </MenuItem>
            </Box>
            </Menu>
          </Box>
          <TravelExploreIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Bookings
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title="Book Activities">
            <IconButton onClick={() => handleNavigation('activities')}>
              <FestivalIcon />              
              <Typography textAlign="center" marginRight={3}>Activities</Typography>
            </IconButton>
            </Tooltip>
            <Tooltip title="Book Itineraries">
            <IconButton onClick={() => handleNavigation('itineraries')}>
              <TempleBuddhistIcon />
              <Typography textAlign="center" marginRight={1}>Itineraries</Typography>
            </IconButton>
            </Tooltip>
            <Tooltip title="Book Flights">
            <IconButton  onClick={() => handleNavigation('flights')}>
              <FlightIcon />
              <Typography textAlign="center" marginRight={1}>Flights</Typography>
            </IconButton>
            </Tooltip>
            <Tooltip title="Book Hotels">
            <IconButton onClick={() => handleNavigation('hotels')}>
              <HotelIcon />
              <Typography textAlign="center" marginRight={1}>Hotels</Typography>
            </IconButton>
            </Tooltip>
            <Tooltip title="Book Transportation">
            <IconButton onClick={() => handleNavigation('transportation')}>
              <DirectionsCarIcon />
              <Typography textAlign="center" marginRight={1}>Transportation</Typography>
            </IconButton>
            </Tooltip>
        <Tooltip title="View My Bookings">
        <IconButton onClick={() => handleNavigation('mybookings')}>
          <BookmarkAddedIcon />
          <Typography textAlign="center" marginRight={1}>My Bookings</Typography>
        </IconButton>
        </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 , ml:4 , width: 40, height: 40}}>
                < AccountCircleIcon sx={{ width: 40, height: 40 }}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            <MenuItem onClick={handleCloseUserMenu}>
  <IconButton component="a" href="/editAccount" sx={{ textAlign: 'center', p: 0.5 }}>
    <AccountCircleIcon sx={{ fontSize: 20 }} />
    <Typography sx={{ ml: 1 }} variant="body2">Profile</Typography>
  </IconButton>
</MenuItem>
<MenuItem onClick={handleCloseUserMenu}>
  <IconButton component="a" href="/changePassword" sx={{ textAlign: 'center', p: 0.5 }}>
    <LockIcon sx={{ fontSize: 20 }} />
    <Typography sx={{ ml: 1 }} variant="body2">Change Password</Typography>
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