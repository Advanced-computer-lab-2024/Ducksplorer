import React from "react";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import IconButton from "@mui/joy/IconButton";
import ShareIcon from '@mui/icons-material/Share';
import Swal from 'sweetalert2';
import Popover from "@mui/material/Popover";
import MuseumDetailedCard from "./MuseumDetailedCard";
import HistoricalDetailedCard from "./HistoricalDetailedCard";
import {message} from 'antd';
import Chip from "@mui/joy/Chip";
import {
  Card,
  Tooltip,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
} from "@mui/material";

const MuseumHistoricalPlaceCard = ({ place }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleShareLink = () => {
    const link = `${window.location.origin}/MuseumTouristPov/${place._id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // alert("Link copied to clipboard!");
      })
      .catch(() => {
        message.alert("Failed to copy link.");
      });
  };



  const handleClick =async (event) => {
    // event.stopPropagation();
    // setAnchorEl(event.currentTarget);
    Swal.fire({
      title: "Share Activity",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <button id="share-link" style="padding: 10px 20px; font-size: 16px; background-color: #ff9933; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Share via Link
          </button>
          <button id="share-mail" style="padding: 10px 20px; font-size: 16px; background-color: #ff9933; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Share via Mail
          </button>
        </div>
      `,
      showConfirmButton: false, // Hide default OK button
      width: "400px", // Set the width of the popup
      padding: "20px", // Add padding to the popup
      customClass: {
        popup: "my-swal-popup", // Optional: Add custom styling via CSS
      },
    });

    // Add click event listeners for custom buttons
    document.getElementById("share-link").addEventListener("click", () => {
      console.log("Sharing via link...");
      handleShareLink();
      Swal.fire("Link copied to clipboard!", "", "success");
    });

    document.getElementById("share-mail").addEventListener("click", () => {
      console.log("Sharing via mail...");
      handleShareEmail();
      // Swal.fire("Shared via Mail!", "", "success");
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
    <div style={{ width: "100%" }}>
    <Card
    onClick={handleOpen}
    className="activity-card"
    variant="outlined"
    sx={{
      width: "100%",
      height: "50vh",
      cursor: "pointer",
    }}
    >
      
      <CardMedia
        component="img"
        image={place.pictures}
        alt={place.name}
        sx={{
          height: 200,
          borderRadius: 2,
          objectFit: "cover",
          mb: 2,
        }}
      />
      <CardOverflow>
            <Tooltip title="Share">
                <IconButton
                  size="md"
                  variant="solid"
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation(); // Prevents the card's onClick from triggering
                    handleClick(); // Executes the share functionality
                  }}
                  sx={{
                    borderRadius: "50%",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    right: "1rem",
                    bottom: 0,
                    transform: "translateY(0%) translateX(-60%)",
                    transition: "transform 0.3s",
                    backgroundColor:  "#ff9933",
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
          </CardOverflow>
          <div style={{ height: "10%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",

                  flexDirection: "column",
                }}
              >
                <h4
                  style={{
                    fontWeight: "bold",
                    margin: 0,
                    marginLeft: 5,
                  }}
                >
                  {place.museumName || place.HistoricalPlaceName}
                </h4>
                <Typography
                variant="h6" // or use "body1" based on your styling preference
                sx={{
                  mb: 1, // Adds margin to the bottom to space it out from the card content
                  marginLeft: "5px",
                }}
              >
                {place.location}
              </Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                  }}
                >
                  {place.tags.map((tag, index) => (
                    <Chip
                      component="span"
                      size="sm"
                      variant="outlined"
                      color="primary"
                      sx={{ marginLeft: 1 }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
      
    </Card>
    <Popover
          open={open}
          anchorEl={null}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          sx={{
            "& .MuiPopover-paper": {
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "none",
              boxShadow: "none",
              padding: 0,
            },
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "60vw",
              maxWidth: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              padding: "30px",
              borderRadius: "16px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#333",
              }}
            >
              &times;
            </button>

            {place.museumName ? (
              // Render MuseumDetailedCard if place.name exists and is not null
              <MuseumDetailedCard museum={place} />
            ) : (
              // Render the other component if place.name is null or undefined
              <HistoricalDetailedCard historicalPlace={place}/>
            )}
          </div>
        </Popover>
    </div>
  );
};

export default MuseumHistoricalPlaceCard;
