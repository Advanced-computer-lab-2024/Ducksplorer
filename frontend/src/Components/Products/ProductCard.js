import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import useUserRole from '../getRole';

const ProductCard = ({ product }) => {
  const role = useUserRole();
  console.log(role);
  return (
    <Card style={{ marginBottom: '20px', maxWidth: '500px' }}>
      <CardMedia
        component="img"
        height="400" // Adjust the height as needed
        image={product.picture}
        alt={product.name}
        style={{ objectFit: 'cover' }} // Ensure the image covers the container
      />
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body1">Price: ${product.price}</Typography>
        <Typography variant="body1">Available Quantity: {product.availableQuantity}</Typography>
        {role === 'Admin' && <Typography variant="body1">Sales: {product.sales}</Typography>}
        {role === 'Seller' && <Typography variant="body1">Sales: {product.sales}</Typography>}
        <Typography variant="body1">Description: {product.description}</Typography>
        <Typography variant="body1">Seller: {product.seller}</Typography>
        <Typography variant="body1">Ratings: {product.ratings.length > 0 ? product.ratings.join(', ') : 'No ratings yet'}</Typography>
        <h4>Reviews:</h4>
        {Object.entries(product.reviews).length > 0 ? (
          Object.entries(product.reviews).map(([user, review]) => (
            <div key={user}>
              <Typography variant="body2">User: {user}</Typography>
              <Typography variant="body2">Rating: {review.rating}</Typography>
              <Typography variant="body2">Comment: {review.comment}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="body2">No reviews available.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
