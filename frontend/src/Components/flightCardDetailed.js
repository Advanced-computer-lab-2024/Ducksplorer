import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function FlightCardDetails({ flightsData }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "100%" }}>
            <AspectRatio ratio="2">
                <img
                    src="/flight.png"
                    alt={flightsData.name || "Flight Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Typography level="h4" sx={{ fontWeight: "bold", fontSize: 30, margin: "5%" }}>
                    {flightsData.companyName || "Unnamed Flight"}
                </Typography>
                <p>
                    <strong>Departure Date:</strong>{" "}
                    {flightsData.departureDate}
                </p>
                <p>
                    <strong>Arrival Date:</strong> {flightsData.arrivalDate}
                </p>
                <p>
                    <strong>Departure City:</strong>{" "}
                    {flightsData.departureCity}
                </p>
                <p>
                    <strong>Departure Country:</strong>{" "}
                    {flightsData.departureCountry}
                </p>
                <p>
                    <strong>Arrival City:</strong> {flightsData.arrivalCity}
                </p>
                <p>
                    <strong>Arrival Country:</strong>{" "}
                    {flightsData.arrivalCountry}
                </p>

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

                    {flightsData.price}
                    {"  "}
                    {flightsData.currency}
                </Typography>

                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {(flightsData.tags || []).map((tag, index) => (
                        <Chip
                            key={index}
                            size="sm"
                            variant="outlined"
                            color="primary"
                        >
                            {tag}
                        </Chip>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
