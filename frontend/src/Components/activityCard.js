import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Popover from "@mui/material/Popover";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Add from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import Done from "@mui/icons-material/Done";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Rating, Tooltip, Box } from "@mui/material";
import Button from "@mui/joy/Button";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import ActivityCardDetails from "./activityCardDetailed";
import { useState, useEffect } from "react";
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import ShareIcon from '@mui/icons-material/Share';
import Swal from 'sweetalert2';

// ActivityCard component
export default function ActivityCard({ activity = {}, onRemove, showNotify }) {
  const navigate = useNavigate();
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(image);
  const handleBooking = async (activityId) => {
    try {
      const userJson = localStorage.getItem("user");
      const isGuest = localStorage.getItem("guest") === "true";
      if (isGuest) {
        message.error("User is not logged in, Please login or sign up.");
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

      const type = "activity";

      localStorage.setItem("activityId", activityId);
      localStorage.setItem("type", type);

      const response = await axios.get(
        `http://localhost:8000/touristRoutes/viewDesiredActivity/${activityId}`
      );

      if (response.status === 200) {
        if (response.data.isUpcoming) {
          navigate("/payment");
        } else {
          message.error("You can't book an old activity");
        }
      } else {
        message.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while booking.");
    }
  };

  React.useEffect(() => {
    setImage(
      `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`
    );
  }, []);


  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username;

  const handleSaveActivity = async (event, activityId, currentIsSaved) => {
    event.stopPropagation();
    try {
      const newIsSaved = !currentIsSaved;

      const response = await axios.put(
        `http://localhost:8000/activity/save/${activityId}`,
        {
          username: username,
          save: newIsSaved,
        }
      );
      if (response.status === 200) {
        setSaveStates((prevState) => ({
          ...prevState,
          [activityId]: newIsSaved, // Update the save state for this activity
        }));
        message.success(
          newIsSaved
            ? "Activity saved successfully!"
            : "Activity removed from saved list!"
        );
        if (!newIsSaved && onRemove) {
          onRemove(activityId);
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
          `http://localhost:8000/activity/getSave/${activity._id}/${userName}`
        );

        console.log("hal heya saved: ", response.data);
        console.log("what is the status ", response.status);

        if (response.status === 200) {
          setSaveStates((prevState) => ({
            ...prevState,
            [activity._id]: response.data.saved, // Update only the relevant activity state
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch save state for ${activity._id}:`, error);
      }
    };
    fetchSaveStates();
  }, [activity._id]);

  const [notificationStates, setNotificationStates] = useState({});

  const requestNotification = async (event, activityId, currentIsNotified) => {
    event.stopPropagation();
    try {
      const newIsNotified = !currentIsNotified;
      
      const response = await axios.post('http://localhost:8000/notification/request', {
        user: username,
        eventId: activityId,
      });

      if (response.status === 201) {
        message.success(
          newIsNotified
            ? "Notifications enabled for this activity!"
            : "Notifications disabled for this activity!"
        );
        setNotificationStates((prev) => ({
          ...prev,
          [activityId]: newIsNotified,
        }));
        message.success('You will be notified when this event starts accepting bookings.');
      } else if(response.status === 200){
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

  const handleShareLink = (activityId) => {
    const link = `${window.location.origin}/activity/searchActivities/${activityId}`; // Update with your actual route
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link.");
      });
  };

  const handleShareEmail = (activityId) => {
    const link = `${window.location.origin}/activity/searchActivities/${activityId}`; // Update with your actual route
    const subject = "Check out this activity";
    const body = `Here is the link to the activity: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };


  const handleClick = (event, activityId) => {
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
      handleShareLink(activityId);
      Swal.fire("Link copied to clipboard!", "", "success");
    });

    document.getElementById("share-mail").addEventListener("click", () => {
      console.log("Sharing via mail...");
      handleShareEmail(activityId);
      // Swal.fire("Shared via Mail!", "", "success");
    });
  };


  const TheCard = () => {
    return (
      <div style={{ width: "100%" }}>
        <Card
          onClick={handleOpen}
          className="activity-card"
          variant="outlined"
          sx={{
            width: "100%",
            height: "400px",
            cursor: "pointer",
          }}
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
                  onClick={(event) => {
                    event.stopPropagation(); // Prevents the card's onClick from triggering
                    handleClick(event,activity._id); // Executes the share functionality
                  }}
                  sx={{
                    borderRadius: "50%",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    right: "1rem",
                    bottom: 0,
                    transform: "translateY(50%) translateX(-130%)",
                    transition: "transform 0.3s",
                    backgroundColor:  "#ff9933",
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            <Tooltip title="Save Activity">
              <IconButton
                size="md"
                variant={saveStates[activity._id] ? "soft" : "solid"}
                color={saveStates[activity._id] ? "neutral" : "primary"}
                onClick={(event) => handleSaveActivity(event, activity._id, saveStates[activity._id])}
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "50%",
                  right: "1rem",
                  bottom: 0,
                  transform: "translateY(50%)",
                  transition: "transform 0.3s",
                  backgroundColor: "#ff9933",
                  "&:active": {
                    transform: "translateY(50%) scale(0.9)",
                  },
                }}
              >
                {saveStates[activity._id] ? <Done color="#ff9933" /> : <Add />}
              </IconButton>
            </Tooltip>
            {showNotify && (
                <Tooltip title="Request Notifications">
                <IconButton
                  size="md"
                  variant="solid"
                  color="primary"
                  onClick={(event) =>
                    requestNotification(event, activity._id, notificationStates[activity._id])
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
                    backgroundColor:  "#ffcc00",
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
                  {activity.name}
                </h4>

                <Rating
                  value={activity.rating}
                  icon={<StarIcon sx={{ color: "orange" }} />}
                  emptyIcon={<StarOutlineIcon />}
                  readOnly
                  precision={0.5}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                  }}
                >
                  {activity.tags.map((tag, index) => (
                    <Chip
                      component="span"
                      size="sm"
                      variant="outlined"
                      color="primary"
                      sx={{ marginRight: 1 }}
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
                {activity.price}$
              </Typography>
              <Button
                size="md"
                variant="solid"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation();
                  handleBooking(activity._id);
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

            <ActivityCardDetails activity={activity} />
          </div>
        </Popover>
      </div>
    );
  };
  return <TheCard />;
}
