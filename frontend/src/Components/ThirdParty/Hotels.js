import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cards from '../Components/Card.js'
const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      const options = {
        method: 'GET',
        url: 'https://example.com/api/v1/hotels', // Replace with your actual API endpoint
        headers: {
          'x-api-key': 'YOUR_API_KEY', // Replace with your actual API key
        }
      };

      try {
        const response = await axios.get(options);
        setHotels(response.data.hotels); // Adjust based on the actual API response structure
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Hotels</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {hotels.map((hotel, index) => (
          <Cards
            key={index}
            name={hotel.name}
            rating={hotel.rooms[0].rating} // Adjust based on the actual API response structure
            description={hotel.rooms[0].description} // Adjust based on the actual API response structure
            size={hotel.rooms[0].size} // Adjust based on the actual API response structure
            price={hotel.rooms[0].price} // Adjust based on the actual API response structure
            
          />
        ))}
      </div>
    </div>
  );
};

export default Hotels;