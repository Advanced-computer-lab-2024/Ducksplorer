import React, { useState } from "react";
import { Button, Typography, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link } from "react-router-dom";
import ExploreIcon from '@mui/icons-material/Explore';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

function LandingPage() {
  const [openTerms, setOpenTerms] = useState(false);

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  React.useEffect(() => {
    // Apply global styles to prevent white borders
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <Typography variant="h2" component="h1" gutterBottom style={styles.title}>
          Welcome to Ducksplorer
        </Typography>
        <Typography variant="h5" component="p" gutterBottom style={styles.subtitle}>
          Discover your next adventure with us
        </Typography>
        <Box mt={4}>
          <Link to="/login" style={styles.link}>
            <Button variant="contained" color="primary" size="large" style={styles.button}>
              Login
            </Button>
          </Link>
          <Link to="/signUp" style={styles.link}>
            <Button variant="outlined" color="primary" size="large" style={styles.button}>
              Sign Up
            </Button>
          </Link>
        </Box>
        <Grid container spacing={4} style={styles.features}>
          <Grid item xs={12} sm={6} md={3} style={styles.featureItem}>
            <ExploreIcon style={styles.icon} />
            <Typography variant="h6" component="p" style={styles.featureText}>
              Explore Destinations
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} style={styles.featureItem}>
            <FlightTakeoffIcon style={styles.icon} />
            <Typography variant="h6" component="p" style={styles.featureText}>
              Book Flights
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} style={styles.featureItem}>
            <HotelIcon style={styles.icon} />
            <Typography variant="h6" component="p" style={styles.featureText}>
              Find Hotels
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} style={styles.featureItem}>
            <BeachAccessIcon style={styles.icon} />
            <Typography variant="h6" component="p" style={styles.featureText}>
              Enjoy Beaches
            </Typography>
          </Grid>
        </Grid>
        <Box mt={4} style={styles.description}>
          <Typography variant="h6" component="p" style={styles.descriptionText}>
            Ducksplorer is your ultimate travel companion. We help you explore new destinations, book flights, find the best hotels, and enjoy beautiful beaches. Start your adventure with us today!
          </Typography>
        </Box>
      </div>
      <footer style={styles.footer}>
        <Typography variant="h6" component="p" style={styles.footerText}>
          Have any questions? We're here to help!
        </Typography>
        <Typography variant="body2" component="p" style={styles.termsLink} onClick={handleOpenTerms}>
          Terms and Conditions
        </Typography>
      </footer>

      <Dialog open={openTerms} onClose={handleCloseTerms}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By using our Site, you affirm that you are at least 18 years old and capable of entering into a legally binding agreement. If you are using the Site on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right to modify or replace these Terms at any time. If we make material changes, we will provide notice on our Site. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Services Offered
          </Typography>
          <Typography paragraph>
            Ducksplorer provides trip planning services, including but not limited to travel itineraries, booking information, and destination recommendations. We do not act as a travel agent, and we do not provide travel services directly.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. User Responsibilities
          </Typography>
          <Typography paragraph>
            When using our Site, you agree to:
          </Typography>
          <ul>
            <li>
              <Typography>
                Provide accurate and complete information when creating an account or making bookings.
              </Typography>
            </li>
            <li>
              <Typography>
                Maintain the confidentiality of your account and password.
              </Typography>
            </li>
            <li>
              <Typography>
                Notify us immediately of any unauthorized use of your account.
              </Typography>
            </li>
            <li>
              <Typography>
                Use the Site only for lawful purposes and in accordance with these Terms.
              </Typography>
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerms} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh", // Covers the full viewport
    background: "url('/travelbg.jpg') no-repeat center center fixed",
    backgroundSize: "cover", // Ensures the image covers the entire screen
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    background: "rgba(255, 255, 255, 0.8)",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "10vh", // Moves content upward
    textAlign: "center",
  },
  title: {
    color: "#ff8c00",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #aaa",
  },
  subtitle: {
    color: "#333",
    marginBottom: "20px",
  },
  link: {
    textDecoration: "none",
    margin: "0 10px",
  },
  button: {
    margin: "10px",
  },
  features: {
    marginTop: "20px",
  },
  featureItem: {
    textAlign: "center",
  },
  icon: {
    fontSize: "40px",
    color: "#ff8c00",
  },
  featureText: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  description: {
    marginTop: "20px",
  },
  descriptionText: {
    color: "#333",
  },
  footer: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 0",
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    zIndex: 10, // Ensures footer is on top of content
  },
  footerText: {
    margin: "5px 0",
  },
  termsLink: {
    cursor: "pointer",
    textDecoration: "underline", // Underlines the link to indicate it's clickable
    color: "#ff8c00", // Color matches the branding
  },
};

export default LandingPage;