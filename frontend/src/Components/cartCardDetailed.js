import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function ActivityCardDetails({ cartData }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <AspectRatio ratio="2">
                <img
                    src={cartData.image || "https://picsum.photos/200/300"}
                    alt={cartData.name || "Cart Data Image"}
                    loading="lazy"
                />
            </AspectRatio>

            <CardContent>
                <Typography level="h4" sx={{ fontWeight: "bold" }}>
                    {"Cart"}
                </Typography>
                {cartData && cartData.products && cartData.products.length > 0 ? (
                    cartData.products.map((product, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <p><strong>Product {index + 1}:</strong></p>
                            <p><strong>Name:</strong> {product.product.name}</p>
                            <p><strong>Price:</strong> {product.product.price}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                        </div>
                    ))
                ) : (
                    <p>No products in the cart.</p>
                )}
                
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
