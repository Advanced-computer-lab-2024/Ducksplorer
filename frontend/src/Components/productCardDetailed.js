import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function ProductCardDetails({ product }) {
  return (
    <Card variant="outlined" sx={{ width: "100%", height: "auto" }}>
      <AspectRatio ratio="2">
        <img
          src={product.picture || "https://picsum.photos/200/300"}
          alt={product.name || "product Image"}
          loading="lazy"
        />
      </AspectRatio>

      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <h4
          style={{
            fontWeight: "bold",
            margin: 20,
            fontSize: 40,
          }}
        >
          {product.name || "Unnamed product"}
        </h4>
        <p>
          <strong>Description:</strong>{" "}
          {product.description || "product description"}
        </p>
        <p>
          <strong>Seller:</strong> {product.seller || "Bin Laden"}
        </p>
        <p>
          <strong>Available Quantity:</strong>{" "}
          {product.availableQuantity || "N/A"}
        </p>
        <p>
          <strong>Reviews:</strong>
        </p>
        <p>
          {product.reviews.map((review, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>
                {review.buyer}:<br />
              </strong>{" "}
              <p style={{ marginLeft: "30px" }}>{review.review}</p>
            </div>
          ))}
        </p>
        <Rating
          value={product.rating || 0}
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
            <Chip component="span" size="sm" variant="soft" color="success">
              Lowest price
            </Chip>
          }
        >
          {product.price}$
        </Typography>

        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}>
          {(product.tags || []).map((tag, index) => (
            <Chip
              key={index}
              size="sm"
              variant="outlined"
              sx={{
                marginRight: 1,
                marginBottom: 1,
                color: "#ff9933",
                borderColor: "#ff9933",
              }}
            >
              {tag}
            </Chip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
