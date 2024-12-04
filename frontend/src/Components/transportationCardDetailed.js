import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";


export default function HotelCardDetailed({ transportation }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <AspectRatio ratio="2">
                <img
                    src={transportation.image || "https://picsum.photos/200/300"}
                    alt={transportation.name || "Hotel Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent>
                <Typography level="h4" sx={{ fontWeight: "bold" }}>
                    {transportation.hotelName || "Unnamed Hotel"}
                </Typography>
                <p>
                    <strong>Departure Date:</strong>{" "}
                    {transportationsData.departureDate}
                </p>
                <p>
                    <strong>Arrival Date:</strong>{" "}
                    {transportationsData.arrivalDate}
                </p>
                <p>
                    <strong>Company Name:</strong>{" "}
                    {transportationsData.companyName}
                </p>
                <p>
                    <strong>Transfer Type:</strong>{" "}
                    {transportationsData.transferType}
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