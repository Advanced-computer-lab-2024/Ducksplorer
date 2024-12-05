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
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <AspectRatio ratio="2">
                <img
                    src="/flight.png"
                    alt={flightsData.name || "Flight Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent>
                <Typography level="h4" sx={{ fontWeight: "bold" }}>
                    {flightsData.companyName || "Unnamed Flight"}
                </Typography>
                <p>
                    <strong>Departure Date:</strong>{" "}
                    {flightsData.departureDate}
                </p>
                <p>
                    <strong>Arrival Date:</strong> {flightsData.arrivalDate}
                </p>
                {/* <p>
                    <strong>Company Name:</strong> {flightsData.companyName}
                </p> */}
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

                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}>
                    {(flightsData.tags || []).map((tag, index) => (
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
