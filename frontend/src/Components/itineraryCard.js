import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Add from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import Done from "@mui/icons-material/Done";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Rating, Tooltip } from "@mui/material";
import Button from "@mui/joy/Button";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";

export default function ItineraryCard({ itinerary = {} }) {
  const navigate = useNavigate();
  const [saved, setSaved] = React.useState(false);
  const [image, setImage] = React.useState("https://picsum.photos/200/300");

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
  const TheCard = () => {
    return (
      <div>
        <Card
          variant="outlined"
          sx={{
            width: "20vw",
            height: "400px",
          }}
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
              onClick={handleSaveClick}
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
                      sx={{ marginRight: 1 , marginBottom: 1}}
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
              <Button size="md" variant="solid" color="primary">
                Book Now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  return <TheCard />;
}
