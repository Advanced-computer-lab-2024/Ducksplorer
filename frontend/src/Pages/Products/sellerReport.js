import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import CurrencyConvertor from '../../Components/CurrencyConvertor';

import {
  Box, Table, Typography, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Rating
} from '@mui/material';
import { Link } from 'react-router-dom';

function MyPurchases() {
  const [products, setProducts] = useState([]);
  const [priceExchangeRates, setPriceExchangeRates] = useState({});
  const [priceCurrency, setPriceCurrency] = useState('EGP');

  const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
  const [earningsCurrency, setEarningsCurrency] = useState('EGP');

  useEffect(() => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string
    const user = JSON.parse(userJson);
    const username = user.username;
    axios
      .get(`http://localhost:8000/sellerRoutes/report/${username}`)
      .then((response) => {
        message.success("Purchases fetched successfully");
        setProducts(response.data);
        console.log("these are the products", response.data.products);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handlePriceCurrencyChange = (rates, selectedCurrency) => {
    setPriceExchangeRates(rates);
    setPriceCurrency(selectedCurrency);
  };

  const handleEarningsCurrencyChange = (rates, selectedCurrency) => {
    setEarningsExchangeRates(rates);
    setEarningsCurrency(selectedCurrency);
  };

  const calculateProductRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return sum / ratings.length;
  };

  return (
    <>
      <Link to="/sellerDashboard"> Back </Link>
      <Box sx={{ p: 6, maxWidth: 1200, overflowY: 'visible', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4">
            Sales Seller Report
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price
                  <CurrencyConvertor onCurrencyChange={handlePriceCurrencyChange} />
                </TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell>Available Quantity</TableCell>
                <TableCell>Picture</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sales</TableCell>
                <TableCell>is Archived</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell>Earnings
                  <CurrencyConvertor onCurrencyChange={handleEarningsCurrencyChange} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name || "N/A"}</TableCell>
                    <TableCell>
                      {((product.price || 0) * (priceExchangeRates[priceCurrency] || 1)).toFixed(2)}{" "}
                      {priceCurrency}
                    </TableCell>
                    <TableCell>
                      <Rating
                        value={calculateProductRating(product.ratings)}
                        precision={0.1}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>{product.availableQuantity || "N/A"}</TableCell>
                    <TableCell>
                      {product.picture ? (
                        <img
                          src={product.picture}
                          alt={product.name}
                          style={{ width: "50px", height: "50px" }}
                        />
                      ) : (
                        "No image available"
                      )}
                    </TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.sales || 0}</TableCell>
                    <TableCell>{product.isArchived ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {product.reviews.length > 0
                        ? product.reviews.map((review, index) => (
                          <div key={index}>
                            {review.buyer}: {review.review}
                          </div>
                        ))
                        : "No reviews"}
                    </TableCell>
                    <TableCell>
                      {(
                        ((product.price || 0) * 0.9 * (product.sales || 0) * (earningsExchangeRates[earningsCurrency] || 1))
                      ).toFixed(2)}{" "}
                      {earningsCurrency}
                    </TableCell>

                  </TableRow>
                )))
                : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No products available
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>

      </Box >
    </>
  );
}

export default MyPurchases;
