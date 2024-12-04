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
import { Rating, Tooltip } from "@mui/material";
import Button from "@mui/joy/Button";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

// ActivityCard component
export default function ActivityCard({ activity = {} }) {
  const navigate = useNavigate();
  const [saved, setSaved] = React.useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);

  function ActivityPopover({ anchorEl, handleClose, activityData }) {
    const open = Boolean(anchorEl);

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            width: "50vw",
            maxWidth: "80%",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <div style={{ width: "100%" }}>
          <Typography
            variant="h3"
            sx={{
              marginBottom: "10px",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "40px",
            }}
          >
            Activity Details
          </Typography>

          <p>
            <strong>Activity Name:</strong>{" "}
            {activityData.name || "Activity Name"}
          </p>

          <p>
            <strong>isOpen:</strong> {JSON.stringify(activityData.isOpen)}
          </p>
          <p>
            <strong>Advertiser:</strong> {activityData.advertiser}
          </p>
          <p>
            <strong>Date:</strong> {activityData.date}
          </p>

          <p>
            <strong>Location:</strong> {activityData.location}
          </p>

          <p>
            <strong>Price:</strong> {activityData.price}
          </p>
          <p>
            <strong>Category:</strong> {activityData.category}
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {activityData.tags && activityData.tags.length > 0
              ? activityData.tags.join(", ")
              : "No tags available"}
          </p>
          <p>
            <strong>Duration:</strong> {activityData.duration}
          </p>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            sx={{
              marginTop: "20px",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              width: "100%",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </div>
      </Popover>
    );
  }
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

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
        }
        else {
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

  const handleSaveClick = (event) => {
    event.stopPropagation();
    setSaved(!saved);
  };

  // const handleSaveActivity = async (activityId, currentIsSaved) => {
  //   try {
  //     const newIsSaved = !currentIsSaved;

  //     const response = await axios.put(
  //       `http://localhost:8000/activity/save/${activityId}`,
  //       {
  //         username: username,
  //         save: newIsSaved,
  //       }
  //     );
  //     if (response.status === 200) {
  //       message.success("Activity saved successfully");
  //       setActivities((prevActivities) =>
  //         prevActivities.map((activity) =>
  //           activity._id === activityId
  //             ? {
  //                 ...activity,
  //                 saved: { ...activity.saved, isSaved: newIsSaved },
  //               }
  //             : activity
  //         )
  //       );
  //     } else {
  //       message.error("Failed to save");
  //     }
  //     setIsSaved(isSaved);
  //   } catch (error) {
  //     console.error("Error toggling save state:", error);
  //   }
  // };

  const TheCard = () => {
    return (
      <div style={{ width: "100%" }}>
        <Card
          onClick={handleOpenPopover}
          className="activity-card"
          variant="outlined"
          sx={{
            width: "100%",
            height: "400px",
          }}
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={image} loading="lazy" alt="" />
            </AspectRatio>
            <Tooltip title="Save Activity">
              <IconButton
                size="md"
                variant={saved ? "soft" : "solid"}
                color={saved ? "neutral" : "primary"}
                onClick={handleSaveClick}
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
                {saved ? <Done color="#ff9933" /> : <Add />}
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
                color="primary"
                className="blackhover"
                zIndex={2}
                onClick={(event) => {
                  event.stopPropagation();
                  handleBooking(activity._id)
                }}
                sx={{ backgroundColor: "#ff9933" }}

              >
                Book Now
              </Button>
            </div>
          </div>
        </Card>
        <ActivityPopover
          anchorEl={anchorEl}
          handleClose={handleClosePopover}
          activityData={activity}
        />
      </div>
    );
  };
  return <TheCard />;
}
