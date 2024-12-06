import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function MuseumDetailedCard({ museum }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <AspectRatio ratio="2">
                <img
                    src={museum.pictures[0] || "https://picsum.photos/200/300"}
                    alt={museum.museumName || "Activity Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent>
                <Typography level="h4" sx={{ fontWeight: "bold" }}>
                    {museum.museumName || "Unnamed Museum"}
                </Typography>
                <p><strong>Location:</strong> {museum.location || "N/A"}</p>
                <p><strong>About:</strong> {museum.description || "N/A"}</p>
                <p><strong>Category:</strong> {museum.museumCategory || "N/A"}</p>
                <p><strong>Opening Time:</strong> {museum.openingTime || "N/A"} A.M</p>
                <p><strong>Closing Time:</strong> {museum.closingTime || "N/A"} P.M</p>

                <Rating
                    value={0}
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
                    {museum.ticketPrices}$
                </Typography>

                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}>
                    {(museum.tags || []).map((tag, index) => (
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