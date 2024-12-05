import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

export default function CartCardDetails({ cartData }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <CardContent>
                <Typography level="h4" sx={{ fontWeight: "bold" }}>
                    {"Cart"}
                </Typography>
                {cartData && cartData.products && cartData.products.length > 0 ? (
                    cartData.products.map((product, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px"
                            }}
                        >
                            {/* Product Image */}
                            <img
                                src={product.product.picture || "https://picsum.photos/50/50"}
                                alt={product.product.name || "Product Image"}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    marginRight: "10px",
                                    borderRadius: "5px",
                                    objectFit: "cover"
                                }}
                            />
                            {/* Product Details */}
                            <div>
                                <p><strong>Product {index + 1}:</strong></p>
                                <p><strong>Name:</strong> {product.product.name}</p>
                                <p><strong>Price:</strong> {product.product.price}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                            </div>
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
                    {localStorage.getItem("totalPrice")}$
                </Typography>
            </CardContent>
        </Card>
    );
}
