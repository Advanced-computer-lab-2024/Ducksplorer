import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Add from "@mui/icons-material/Add";
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

function ItineraryPopover({ anchorEl, handleClose, itineraryData }) {
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
          variant="h5"
          sx={{ marginBottom: "10px", fontWeight: "bold" }}
        >
          Itinerary Details
        </Typography>

        <p>
          <strong>Itinerary Name:</strong>{" "}
          {itineraryData.name || "Itinerary Name"}
        </p>

        {itineraryData.activity && itineraryData.activity.length > 0 ? (
          itineraryData.activity.map((activity, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Activity Name:</strong> {activity.name}
              </p>
              <p>
                <strong>Activity Price:</strong> {activity.price}
              </p>
            </div>
          ))
        ) : (
          <p>No activities found.</p>
        )}

        <p>
          <strong>Locations:</strong> {itineraryData.locations.join(", ")}
        </p>
        <p>
          <strong>Timeline:</strong> {itineraryData.timeline}
        </p>
        <p>
          <strong>Language:</strong> {itineraryData.language}
        </p>
        <p>
          <strong>Price:</strong> {itineraryData.price}
        </p>

        <p>
          <strong>Available Dates and Times:</strong>
          {itineraryData.availableDatesAndTimes.length > 0
            ? itineraryData.availableDatesAndTimes.map((dateTime, index) => {
              const dateObj = new Date(dateTime);
              const date = dateObj.toISOString().split("T")[0];
              const time = dateObj.toTimeString().split(" ")[0];
              return (
                <div key={index}>
                  Date {index + 1}: {date}
                  <br />
                  Time {index + 1}: {time}
                </div>
              );
            })
            : "No available dates and times"}
        </p>

        <p>
          <strong>Accessibility:</strong> {itineraryData.accessibility}
        </p>
        <p>
          <strong>Pick Up Location:</strong> {itineraryData.pickUpLocation}
        </p>
        <p>
          <strong>Drop Off Location:</strong> {itineraryData.dropOffLocation}
        </p>
        <p>
          <strong>Rating:</strong>{" "}
          {itineraryData.activity.averageRating ||
            itineraryData.activity.averageRating === 0
            ? `${itineraryData.activity.averageRating}/5`
            : `0/5`}
        </p>

        <p>
          <strong>Tags:</strong>{" "}
          {itineraryData.tags && itineraryData.tags.length > 0
            ? itineraryData.tags.join(", ")
            : "No tags available"}
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

export default function ItineraryCard({ itinerary = {} }) {
  const navigate = useNavigate();
  const [saved, setSaved] = React.useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");
  const [anchorEl, setAnchorEl] = React.useState(null);

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
  const handleSaveClick = () => {
    setSaved(!saved);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
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
          onClick={handleOpenPopover}
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={image} loading="lazy" alt="" />
            </AspectRatio>
            <Tooltip title="Save itinerary">
              <IconButton
                size="md"
                variant="solid"
                color="primary"
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "50%",
                  right: "1rem",
                  bottom: 0,
                  transform: "translateY(50%)",
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>

            <IconButton
              size="md"
              variant={saved ? "soft" : "solid"}
              color={saved ? "neutral" : "primary"}
              onClick={(event) => {
                event.stopPropagation();
                handleSaveClick();
              }}
              sx={{
                position: "absolute",
                zIndex: 2,
                borderRadius: "50%",
                right: "1rem",
                bottom: 0,
                transform: "translateY(50%)",
                transition: "transform 0.3s",
                "&:active": {
                  transform: "translateY(50%) scale(0.9)",
                },
              }}
            >
              {saved ? <Done color="primary" /> : <Add />}
            </IconButton>
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
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleBooking(itinerary._id);
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </Card>
        <ItineraryPopover
          anchorEl={anchorEl}
          handleClose={handleClosePopover}
          itineraryData={itinerary}
        />
      </div>
    );
  };
  return <TheCard />;
}
