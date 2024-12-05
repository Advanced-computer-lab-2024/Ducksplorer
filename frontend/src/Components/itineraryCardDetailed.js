import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function ItineraryCardDetails({ itinerary }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <AspectRatio ratio="2">
                <img
                    src={itinerary.image || "https://picsum.photos/200/300"}
                    alt={itinerary.name || "Activity Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent>
                <h4
                    style={{
                        fontWeight: "bold",
                        margin: 0,
                        marginRight: 20,
                    }}
                >
                    {itinerary.name || "Itinerary Name"}
                </h4>
                {itinerary.activity && itinerary.activity.length > 0 ? (
                    itinerary.activity.map((activity, index) => (
                        <div key={index}>
                            <p><strong>Activity Name:</strong> {activity.name}</p>
                            <p><strong>Activity Price:</strong> {activity.price}</p>
                            <p><strong>Activity Category:</strong> {activity.category}</p>
                        </div>
                    ))
                ) : (
                    <p>No activities found.</p>
                )}
                <p><strong>Locations:</strong> {itinerary.locations.join(', ')}</p>
                <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                <p><strong>Language:</strong> {itinerary.language}</p>
                <p><strong>Available Dates and Times:</strong> {itinerary.availableDatesAndTimes.length > 0
                    ? itinerary.availableDatesAndTimes.map((dateTime, index) => {
                        const dateObj = new Date(dateTime);
                        const date = dateObj.toISOString().split('T')[0];
                        const time = dateObj.toTimeString().split(' ')[0];
                        return (
                            <div key={index}>
                                Date {index + 1}: {date}<br />
                                Time {index + 1}: {time}
                            </div>
                        );
                    })
                    : 'No available dates and times'}</p>
                <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                <p><strong>Pick Up Location:</strong> {itinerary.pickUpLocation}</p>
                <p><strong>Drop Off Location:</strong> {itinerary.dropOffLocation}</p>

                <Rating
                    value={itinerary.rating || 0}
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
                    {itinerary.price}$
                </Typography>

                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}>
                    {(itinerary.tags || []).map((tag, index) => (
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
