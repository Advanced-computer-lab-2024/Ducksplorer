import React, { useState } from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product }) => {

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="scrollable-container">
    <boxF key={product.id}>
      <h4>Name: {product.name}</h4>
      <p><strong>Price: </strong>{product.price}</p>
      <p><strong>Ratings: </strong>{product.ratings}</p>
      <p><strong>Available Quantity: </strong>{product.availableQuantity}</p>
      <p><strong>Picture: </strong>
      {imageError ? (
        <p>Image not available</p>
      ) : (
        <img src={`/uploads/${product.picture}`} alt="Product Image" onError={handleImageError} />
      )}      </p>
      <p><strong>Description: </strong>{product.description}</p>
      <p><strong>Seller: </strong>{product.seller}</p>
      {product.reviews && product.reviews.length > 0 && (
        <section className="reviews-section">
          <strong>Reviews:</strong>
          <ul>
            {product.reviews.map(review => (
              <li key={review._id}>
                <p><strong>User: </strong>{review.user}</p>
                <p><strong>Comment: </strong>{review.comment}</p>
                <p><strong>Date: </strong>{review.date}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p>{product.createdAt}</p>
    </boxF>
    </div>
)
}
              
  export default ProductDetails