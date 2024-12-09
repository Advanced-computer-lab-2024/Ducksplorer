import React, { useEffect, useState } from 'react';
import HotelCards from './HotelCard';
import TouristNavbar from '../TouristNavBar'; // Import TouristNavbar

const HotelsPage = () => {
  const [hotelsData, setHotelsData] = useState(null);

  useEffect(() => {
    const storedHotelsData = localStorage.getItem('hotelsData');
    if (storedHotelsData) {
      setHotelsData(JSON.parse(storedHotelsData));
    }
  }, []);

  if (!hotelsData) {
    return <div>Loading...</div>;
  }

  const { hotels, checkInDate, checkOutDate, city, country, adults } = hotelsData;

  return (
    <div style={styles.container}>
      <TouristNavbar /> {/* Add TouristNavbar */}
      <h1
        className="duckTitle"
        style={{
          textAlign: "center",
          marginLeft: "20px",
          fontSize: "40px",
          fontWeight: "700",
          color: "orange",
          marginTop:"2%",
          fontSize: '2rem'
        }}>
        Available Hotels
      </h1>
      <HotelCards
        hotels={hotels}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        city={city}
        country={country}
        adults={adults}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', // Add this line to stack elements vertically
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: "#fff6e6",
  },
};

export default HotelsPage;
