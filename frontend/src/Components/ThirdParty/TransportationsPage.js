import React, { useEffect, useState } from 'react';
import TransportationsCards from './transportationsCards';
import TouristNavbar from '../TouristNavBar'; // Import TouristNavbar

const TransportationsPage = () => {
  const [transportationsData, setTransportationsData] = useState(null);

  useEffect(() => {
    const storedTransportationsData = localStorage.getItem('transportationsData');
    if (storedTransportationsData) {
      setTransportationsData(JSON.parse(storedTransportationsData));
    }
  }, []);

  if (!transportationsData) {
    return <div>Loading...</div>;
  }

  const { transportations, startLocationCode, endAddressLine, endCountryCode, transferType, startDateTime } = transportationsData;

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
          fontSize: '2rem',
          marginTop:"2%"
        }}>
        Available Transportations
      </h1>
      <TransportationsCards
        transportations={transportations}
        startLocationCode={startLocationCode}
        endAddressLine={endAddressLine}
        endCountryCode={endCountryCode}
        transferType={transferType}
        startDateTime={startDateTime}
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

export default TransportationsPage;
