import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";


export default function HotelCardDetailed({ hotelsData }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "84.5vh" }}>
            <AspectRatio ratio="1.5">
                <img
                    src={hotelsData.image || "https://picsum.photos/200/300"}
                    alt={hotelsData.name || "Hotel Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Typography level="h4" sx={{ fontWeight: "bold", fontSize: 30, margin: "2%" }}>
                    {hotelsData.hotelName || "Unnamed Hotel"}
                </Typography>
                <p><strong>Location:</strong> {hotelsData.city}{"  ,"}{hotelsData.country}</p>

                <p>
                    <strong>Check In Date:</strong> {new Date(hotelsData.checkInDate).toLocaleDateString()}
                </p>
                <p>
                    <strong>Check Out Date:</strong> {new Date(hotelsData.checkOutDate).toLocaleDateString()}
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

                    {hotelsData.price}
                    {"  "}
                    {hotelsData.currency}
                </Typography>

            </CardContent>
        </Card>
    );
}
