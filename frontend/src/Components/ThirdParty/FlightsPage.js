import React, { useEffect, useState } from "react";
import FlightsCards from "./FlightsCards";
import TouristNavbar from "../TouristNavBar"; // Import TouristNavbar

const FlightsPage = () => {
  const [flightsData, setFlightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedFlightsData = localStorage.getItem("flightsData");
    if (storedFlightsData) {
      setFlightsData(JSON.parse(storedFlightsData));
    }
  }, []);

  if (!flightsData) {
    return <div>Loading...</div>;
  }

  const { flights, origin, destination, departureDate } = flightsData;

  return (
    <div style={styles.container}>
      <TouristNavbar onCurrencyChange={() => {}} /> {/* Add TouristNavbar with onCurrencyChange prop */}
      <h1
        className="duckTitle"
        style={{
          textAlign: "center",
          marginLeft: "20px",
          fontSize: "40px",
          fontWeight: "700",
          color: "orange",
          fontSize: "2rem",
          marginTop:"2%"
        }}
      >
        Available Flights
      </h1>
      <FlightsCards
        flights={flights}
        originCity={origin.label}
        destinationCity={destination.label}
        originCountry={origin.country}
        destinationCountry={destination.country}
        departureDate={departureDate}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column", // Add this line to stack elements vertically
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#fff6e6",
  },
};

export default FlightsPage;
