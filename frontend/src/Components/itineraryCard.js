import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import BookmarksIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import Done from "@mui/icons-material/Done";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Rating, Tooltip } from "@mui/material";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Popover from "@mui/material/Popover";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import ItineraryCardDetails from "./itineraryCardDetailed";
import { useState, useEffect } from "react";
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import ShareIcon from '@mui/icons-material/Share';
import {Menu, MenuItem} from "@mui/material";
import Swal from 'sweetalert2'


export default function ItineraryCard({ itinerary = {}, onRemove, showNotify }) {
  const navigate = useNavigate();
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = (event, itineraryId) => {
    event.stopPropagation();
    // setAnchorEl(event.currentTarget);
    Swal.fire({
      title: "Share Itinerary",
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
      handleShareLink(itineraryId);
      Swal.fire("Link copied to clipboard!", "", "success");
    });

    document.getElementById("share-mail").addEventListener("click", () => {
      console.log("Sharing via mail...");
      handleShareEmail(itineraryId);
      // Swal.fire("Shared via Mail!", "", "success");
    });
  };

  const handleBooking = async (itineraryId) => {
    try {
      const userJson = localStorage.getItem("user");
      const isGuest = localStorage.getItem("guest") === "true";
      if (isGuest) {
        message.error("Can't book as a guest, Please login or sign up.");
        navigate("/guestDashboard");
        return;
      }
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }
      // const userName = user.username;
      const type = "itinerary";

      localStorage.setItem("itineraryId", itineraryId);
      localStorage.setItem("type", type);

      const response = await axios.get(
        `http://localhost:8000/touristRoutes/viewDesiredItinerary/${itineraryId}`
      );

      if (response.status === 200) {
        if (response.data.isUpcoming) {
          navigate("/payment");
        }
        else {
          message.error("You can't book an old itinerary");
        }
      } else {
        message.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };

  const handleShareLink = (itineraryId) => {
    const link = `${window.location.origin}/viewAllTourist/${itineraryId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (itineraryId) => {
    const link = `${window.location.origin}/viewAllTourist/${itineraryId}`; // Update with your actual route
    window.location.href = `mailto:?subject=Check out this itinerary&body=Here is the link to the itinerary: ${link}`;
  };

  React.useEffect(() => {
    setImage(
      `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
    );
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  const handleSaveItinerary = async (itineraryId, currentIsSaved) => {
    try {
      const newIsSaved = !currentIsSaved;

      const response = await axios.put(
        `http://localhost:8000/itinerary/save/${itineraryId}`,
        {
          username: username,
          save: newIsSaved,
        }
      );
      if (response.status === 200) {
        setSaveStates((prevState) => ({
          ...prevState,
          [itineraryId]: newIsSaved, // Update the save state for this itinerary
        }));
        message.success(
          newIsSaved
            ? "Itinerary saved successfully!"
            : "Itinerary removed from saved list!"
        );
        if (!newIsSaved && onRemove) {
          onRemove(itineraryId);
        }
      } else {
        message.error("Failed to save");
      }
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  const [saveStates, setSaveStates] = useState({});

  useEffect(() => {
    const fetchSaveStates = async () => {
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;

      try {
        const response = await axios.get(
          `http://localhost:8000/itinerary/getSave/${itinerary._id}/${userName}`
        );

        console.log("hal heya saved: ", response.data);
        console.log("what is the status ", response.status);

        if (response.status === 200) {
          setSaveStates((prevState) => ({
            ...prevState,
            [itinerary._id]: response.data.saved, // Update only the relevant activity state
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch save state for ${itinerary._id}:`, error);
      }
    };
    fetchSaveStates();
  }, [itinerary._id]);

  const [notificationStates, setNotificationStates] = useState({});

  const requestNotification = async (event, itineraryId, currentIsNotified) => {
    event.stopPropagation();
    try {
      const newIsNotified = !currentIsNotified;

      const response = await axios.post('http://localhost:8000/notification/request', {
        user: username,
        eventId: itineraryId,
      });

      if (response.status === 201) {
        message.success(
          newIsNotified
            ? "Notifications enabled for this itinerary!"
            : "Notifications disabled for this activity!"
        );
        setNotificationStates((prev) => ({
          ...prev,
          [itineraryId]: newIsNotified,
        }));
        message.success('You will be notified when this event starts accepting bookings.');
      } else if (response.status === 200) {
        message.info('You have already requested to be notified for this activity');
      }
      else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error requesting notification:', error);
      message.error('Failed to request notification.');
    }
  };


  const TheCard = () => {
    return (
      <div>
        <Card
          className="itinerary-card"
          variant="outlined"
          sx={{
            width: "20vw",
            height: "400px",
          }}
          onClick={handleOpen}
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={image} loading="lazy" alt="" />
            </AspectRatio>
            <Tooltip title="Share">
                <IconButton
                  size="md"
                  variant="solid"
                  color="primary"
                  onClick={(event) => handleClick(event, itinerary._id)}
                  sx={{
                    borderRadius: "50%",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    right: "1rem",
                    bottom: 0,
                    transform: "translateY(50%) translateX(-130%)",
                    transition: "transform 0.3s",
                    "&:active": {
                      transform: "translateY(50%) scale(0.9)",
                    },
                    backgroundColor:  "#ff9933",
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>

       

            <Tooltip title="Save itinerary">
              <IconButton
                size="md"
                variant="solid"
                color="black"
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "100%",
                  height: "10px",
                  width: "10px",
                  right: "1rem",
                  fontSize: "3px",
                  bottom: 0,
                  transform: "translateY(50%)",
                  size: "1px",
                  backgroundColor: "#ff9933",
                }}
              >
                <BookmarksIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              size="md"
              variant={saveStates[itinerary._id] ? "soft" : "solid"}
              color={saveStates[itinerary._id] ? "neutral" : "primary"}
              onClick={(event) => {
                event.stopPropagation();
                handleSaveItinerary(itinerary._id, saveStates[itinerary._id])
              }}
              onMouseEnter={(e) => (e.target.style.cursor = 'pointer')}
              onMouseLeave={(e) => (e.target.style.cursor = 'default')}
              sx={{
                position: "absolute",
                zIndex: 2,
                borderRadius: "50%",
                right: "1rem",
                bottom: 0,
                height: "10px",
                width: "10px",
                fontSize: "3px",
                transform: "translateY(50%)",
                transition: "transform 0.3s",
                backgroundColor: "#ff9933",
                "&:active": {
                  transform: "translateY(50%) scale(0.9)",
                },
              }}
            >
              {saveStates[itinerary._id] ? <Done color="#ff9933" /> : <BookmarksIcon />}
            </IconButton>
            {showNotify && (
              <Tooltip title="Request Notifications">
                <IconButton
                  size="md"
                  variant="solid"
                  color="primary"
                  onClick={(event) =>
                    requestNotification(event, itinerary._id, notificationStates[itinerary._id])
                  }
                  sx={{
                    borderRadius: "50%",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    right: "1rem",
                    bottom: 0,
                    transform: "translateY(50%) translateX(-260%)",
                    transition: "transform 0.3s",
                    "&:active": {
                      transform: "translateY(50%) scale(0.9)",
                    },
                    backgroundColor: "#ffcc00",
                  }}
                >
                  <NotificationAddOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}
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
                    marginRight: 20,
                  }}
                >
                  {itinerary.name || "Itinerary Name"}
                </h4>

                <Rating
                  value={itinerary.rating}
                  icon={<StarIcon sx={{ color: "ff9933" }} />}
                  emptyIcon={<StarOutlineIcon />}
                  readOnly
                  precision={0.5}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  {itinerary.tags.map((tag, index) => (
                    <Chip
                      component="span"
                      size="sm"
                      variant="outlined"
                      color="primary"
                      sx={{ marginRight: 1, marginBottom: 1 }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 10,
                width: "90%",
              }}
            >
              <Typography
                level="title-lg"
                sx={{
                  mt: 1,
                  fontSize: 25,
                  fontWeight: "xl",
                  justifySelf: "flex-start",
                }}
                endDecorator={
                  <Chip
                    component="span"
                    size="sm"
                    variant="soft"
                    color="success"
                  >
                    Lowest price
                  </Chip>
                }
              >
                {itinerary.price}$
              </Typography>
              <Button
                size="md"
                variant="solid"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation();
                  handleBooking(itinerary._id);
                }}
                sx={{ backgroundColor: "#ff9933" }}
              >
                Book Now
              </Button>
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

            <ItineraryCardDetails itinerary={itinerary} />
          </div>
        </Popover>

      </div>
    );
  };
  return <TheCard />;
}
