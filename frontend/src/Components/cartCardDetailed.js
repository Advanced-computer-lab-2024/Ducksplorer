import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

export default function CartCardDetails({ cartData }) {
    return (
        <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <h4 style={{
                    fontWeight: "bold",
                    fontSize: 40,
                    margin: 20,
                }}>
                    Cart
                </h4>
                {cartData && cartData.products && cartData.products.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "3%", // Adds spacing between product groups
                        }}
                    >
                        {cartData.products.map((product, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "column", // Arrange items vertically within each product
                                    alignItems: "center",
                                    width: "calc(50% - 2%)", // Two items per row
                                    marginBottom: "3%",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "10px",
                                }}
                            >
                                {/* Product Name */}
                                <p style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
                                    Product {index + 1}: {product.product.name}
                                </p>
                                {/* Product Image */}
                                <img
                                    src={product.product.picture || "https://picsum.photos/100/100"}
                                    alt={product.product.name || "Product Image"}
                                    style={{
                                        width: "50%",
                                        height: "50%",
                                        marginBottom: "10px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                    }}
                                />
                                {/* Product Details */}
                                <div style={{ textAlign: "center" }}>
                                    <p>
                                        <strong>Price:</strong> {product.product.price}
                                    </p>
                                    <p>
                                        <strong>Quantity:</strong> {product.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
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
