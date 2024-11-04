import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Typography } from '@mui/material';
import {  Button } from '@mui/material';
import ProductCard from '../../Components/Products/ProductCard'; // Import the ProductCard component


function TouristProducts() {
  const [products,setProducts] = useState([]);

  useEffect(() => {
    axios.get(
      "http://localhost:8000/adminRoutes/getproducts"
    ).then(response => {
      message.success("Products fetched successfully");
      setProducts(response.data);
    }).catch(error => {
      console.error('There was an error fetching the products!', error);
    });
  }, []);


  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handlePurchase = async (product) => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const userName = user.username;
    try{
        const response = await axios.put(`http://localhost:8000/touristRoutes/updatePurchases/${userName}`, {
            products: [product]
        });
        if (response.status === 200) {
            message.success("Product purchased successfully!");
        } else {
            message.error("Failed to purchase product.");
        }
    }
    catch(error){
        message.error("An error occurred while purchasing the product.");
    }
  };


  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Button onClick={handleBackButtonClick}>Back</Button>

      <div style={{ maxHeight: '400px', overflowY: 'visible', padding: '10px', marginTop: '20px' }}>
        {/* Render the filtered products using the ProductCard component */}
        {products.filter(product => product.isArchived !== true).length > 0 ? (
        products
          .filter(product => product.isArchived !== true)
          .map((product) => (
            <div
              key={product._id}
              style={{ position: "relative", marginBottom: "20px" }}
            >
              <ProductCard product={product} showRating={false}/>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handlePurchase(product)}
                style={{ position: "absolute", right: "10px", bottom: "10px" }} // Place the button at the bottom-right corner
              >
                Purchase
              </Button>
            </div>
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No products found.
          </Typography>
        )}
      </div>
    </div>
  );

}


export default TouristProducts;