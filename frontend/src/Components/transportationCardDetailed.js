import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

export default function TransportationCardDetailed({ transportation }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "84.5vh" }}>
            <AspectRatio ratio="1.75">
                <img
                    src={transportation.image || "https://picsum.photos/200/300"}
                    alt={transportation.name || "Hotel Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <h4 style={{
                    fontWeight: "bold",
                    margin: "3%",
                    fontSize: 40
                }}>
                    {transportation.companyName}
                </h4>
                <p>
                    <strong>Departure Date:</strong>{" "}
                    {transportation.departureDate}
                </p>
                <p>
                    <strong>Arrival Date:</strong>{" "}
                    {transportation.arrivalDate}
                </p>
                <p>
                    <strong>Company Name:</strong>{" "}
                    {transportation.companyName}
                </p>
                <p>
                    <strong>Transfer Type:</strong>{" "}
                    {transportation.transferType}
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

                    {transportation.price}
                    {"  "}
                    {transportation.currency}
                </Typography>

            </CardContent>
        </Card>
    );
}
