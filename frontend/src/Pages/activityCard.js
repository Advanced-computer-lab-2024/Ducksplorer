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
import Notifications from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Rating } from "@mui/material";
import Button from "@mui/joy/Button";
export default function ActivityCard({
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  title = "Mountain Hiking",
  location = "Himalayas",
  price = "$100",
  tags = ["pool", "Budget friendly"],
}) {
  const TheCard = () => {
    return (
      <div>
        <Card
          variant="outlined"
          sx={{
            width: "20vw",
            maxHeight: "40vh",
          }}
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={image} loading="lazy" alt="" />
            </AspectRatio>
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
              <Notifications />
            </IconButton>
          </CardOverflow>
          <div style={{ height: "10%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 10,
              }}
            >
              {/* <Typography
            level="body-sm"
            sx={{ height: "20%", transform: "translateY(2px)" }}
          >
            <Link href="#multiple-actions">{location}</Link>
          </Typography> */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4
                  style={{
                    fontWeight: "bold",
                    margin: 0,
                    marginRight: 20,
                  }}
                >
                  {title}
                </h4>
              </div>
              <Rating
                value="3.5"
                icon={<StarIcon sx={{ color: "orange" }} />}
                emptyIcon={<StarOutlineIcon />}
                readOnly
                precision={0.5}
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
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
          <CardOverflow variant="soft">
            <Divider inset="context" />
          </CardOverflow>
        </Card>
      </div>
    );
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "24px", // Adjust the gap between items as needed
      }}
    >
      <TheCard />
      <TheCard />
      <TheCard />
      <TheCard />
      <TheCard />
      <TheCard />
      <TheCard />
      <TheCard />
      <TheCard />
    </div>
  );
}
