import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
} from "@mui/material";

const MuseumHistoricalPlaceCard = ({ place }) => {
  const handleShareLink = () => {
    const link = `${window.location.origin}/MuseumTouristPov/${place._id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy link.");
      });
  };

  const handleShareEmail = () => {
    const link = `${window.location.origin}/MuseumTouristPov/${place._id}`;
    const subject = "Check out this place";
    const body = `Here is the link to the place: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Card
      style={{
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        margin: "16px",
        width: "100%", // Ensure the card takes the full width of its container
        maxWidth: "300px",
        height: "70vh", // Set a fixed height for all cards
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={place.pictures}
        alt={place.name}
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {place.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {place.description}
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Location: {place.location}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ticket Price: {place.ticketPrices} {place.currency}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Opening Time: {place.openingTime}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Closing Time: {place.closingTime}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Date: {place.date}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Category: {place.category}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tags: {place.tags.join(", ")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Created By: {place.createdBy}
          </Typography>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" size="small" onClick={handleShareLink}>
            Share Link
          </Button>
          <Button variant="outlined" size="small" onClick={handleShareEmail}>
            Share Email
          </Button>
          <Button variant="contained" size="small" color="primary">
            Visit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MuseumHistoricalPlaceCard;
