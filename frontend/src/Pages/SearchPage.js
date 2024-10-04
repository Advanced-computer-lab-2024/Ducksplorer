import React from 'react';
import { useEffect, useState } from "react"
import SearchBar from '../Components/SearchBar';
import ProductDetails from '../Components/ProductDetails';
import '../Components/ProductDetails.css';
import axios from 'axios';

const SearchPage = ({productName}) => {
  
  const [products, setProducts] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    try {
      const response = await axios.get('http://localhost:8000/sellerRoutes/findProduct',
        {
          params: {
            name: e
          }
        }
      ); // Build search URL
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  
    return (
      <div className="containerF">
          <div className="columnF">
          <SearchBar onSearch={handleSearch} />
          {products && products.map(product => (
          <ProductDetails product={product} key={product._id} />
          ))}
        </div>
      </div>
    )
};

export default SearchPage;