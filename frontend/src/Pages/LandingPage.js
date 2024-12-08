import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden"; // Disable scrolling
    document.body.style.height = "100%"; // Ensure full height
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <Typography variant="h3" style={styles.welcomeText} className="duckTitle">
          Welcome to Ducksplorer
        </Typography>
        <Typography variant="h5" style={{ ...styles.descriptionText, color: "#fff", fontSize: "1.5rem" }} className="duckTitle">
          Get your ducks in a row.
        </Typography>
      </div>
      <div style={styles.rightSection}>
        <Box style={styles.content}>
          <Typography variant="h4" style={styles.title} className="duckTitle">
            Ducksplorer
          </Typography>
          <Box mt={4}>
            <Link to="/login" style={styles.link}>
              <Button variant="contained" color="primary" size="large" style={styles.button}>
                Login
              </Button>
            </Link>
            <Link to="/signUp" style={styles.link}>
              <Button variant="outlined" size="large" style={{ ...styles.button, ...styles.signUpButton }}>
                Sign Up
              </Button>
            </Link>
          </Box>
          <Grid container spacing={4} style={styles.features}>
            <Grid item xs={12} sm={6} md={3} style={styles.featureItem}>
              <ExploreIcon style={styles.icon} />
              <Typography variant="h6" component="p" style={styles.featureText}>
                Explore Areas
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
            <Typography variant="h6" component="p" style={{ ...styles.descriptionText, textAlign: "justify" }}>
              Ducksplorer is your ultimate travel companion. We help you explore new destinations, book flights, find the best hotels, and enjoy beautiful beaches. Start your adventure with us today!
            </Typography>
          </Box>
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
          <Typography paragraph style={{ textAlign: "justify" }}>
            By using our Site, you affirm that you are at least 18 years old and capable of entering into a legally binding agreement. If you are using the Site on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Changes to Terms
          </Typography>
          <Typography paragraph style={{ textAlign: "justify" }}>
            We reserve the right to modify or replace these Terms at any time. If we make material changes, we will provide notice on our Site. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Services Offered
          </Typography>
          <Typography paragraph style={{ textAlign: "justify" }}>
            Ducksplorer provides trip planning services, including but not limited to travel itineraries, booking information, and destination recommendations. We do not act as a travel agent, and we do not provide travel services directly.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. User Responsibilities
          </Typography>
          <Typography paragraph style={{ textAlign: "justify" }}>
            When using our Site, you agree to:
          </Typography>
          <ul>
            <li>
              <Typography style={{ textAlign: "justify" }}>
                Provide accurate and complete information when creating an account or making bookings.
              </Typography>
            </li>
            <li>
              <Typography style={{ textAlign: "justify" }}>
                Maintain the confidentiality of your account and password.
              </Typography>
            </li>
            <li>
              <Typography style={{ textAlign: "justify" }}>
                Notify us immediately of any unauthorized use of your account.
              </Typography>
            </li>
            <li>
              <Typography style={{ textAlign: "justify" }}>
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
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "url('/travelbg.jpg') no-repeat center center fixed",
    backgroundSize: "cover",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "20px",
  },
  rightSection: {
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    overflow: "auto"
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  descriptionText: {
    fontSize: "1rem", // Make the paragraph text smaller
    textAlign: "justify",
    color: "#333",
  },
  content: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 11px 1px",
    textAlign: "center",
    backgroundColor: "white",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  title: {
    color: "#ff8c00",
    fontWeight: "bold",
    marginBottom: "40px",
    fontSize: "30px",
    textAlign: "center"
  },
  link: {
    textDecoration: "none",
    margin: "0 10px",
  },
  button: {
    margin: "10px",
    backgroundColor: "#ff8c00",
    color: "#fff",
  },
  signUpButton: {
    backgroundColor: "#fff", // White background
    borderColor: "#ff8c00", // Orange border
    color: "#ff8c00", // Orange font
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
    marginBottom: "10px", // Add margin to separate the icon from the text
  },
  featureText: {
    marginTop: "10px",
    fontWeight: "bold",
    marginLeft: "10px", // Add margin to separate the text from the icon
    textAlign: "center", // Center the text under the icon
    fontSize: "0.875rem", // Make the text smaller
  },
  description: {
    marginTop: "20px",
  },
  footer: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 0",
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    zIndex: 10,
  },
  footerText: {
    margin: "5px 0",
  },
  termsLink: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#ff8c00",
  },
};

export default LandingPage;