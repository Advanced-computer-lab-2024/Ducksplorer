import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function ActivityCardDetails({ activity }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <AspectRatio ratio="2">
                <img
                    src={activity.image || "https://picsum.photos/200/300"}
                    alt={activity.name || "Activity Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <h4 style={{
                    fontWeight: "bold",
                    margin: 20,
                    fontSize: 40
                }}>
                    {activity.name || "Unnamed Activity"}
                </h4>
                <p><strong>Is Open:</strong> {activity.isOpen ? "Yes" : "No"}</p>
                <p><strong>Category:</strong> {activity.category || "N/A"}</p>
                <p><strong>Duration:</strong> {activity.duration || "N/A"} hours</p>
                <p><strong>Location:</strong> {activity.location || "N/A"}</p>

                <Rating
                    value={activity.rating || 0}
                    icon={<StarIcon sx={{ color: "orange" }} />}
                    emptyIcon={<StarOutlineIcon />}
                    readOnly
                    precision={0.5}
                />

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

                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}>
                    {(activity.tags || []).map((tag, index) => (
                        <Chip
                            key={index}
                            size="sm"
                            variant="outlined"
                            color="primary"
                            sx={{ marginRight: 1, marginBottom: 1 }}
                        >
                            {tag}
                        </Chip>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
