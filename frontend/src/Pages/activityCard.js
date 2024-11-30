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

// ActivityCard component
export default function ActivityCard({
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  title = "Mountain Hiking",
  location = "Himalayas",
  price = "$100",
  tags = ["pool", "Budget friendly"],
  rating = "3.5",
}) {
  const [saved, setSaved] = React.useState(false);

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
            <Tooltip title="Save Activity">
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
                  {title}
                </h4>

                <Rating
                  value={rating}
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
                  {tags.map((tag, index) => (
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
                {price}
              </Typography>
              <Button size="md" variant="solid" color="primary" style={{}}>
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
