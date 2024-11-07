import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import CurrencyConverterGeneral from "./CurrencyConverterGeneral";
import { Button } from "@mui/material";
import axios from "axios";

const FlightsCards = ({ flights }) => {
  const initialCurrency = flights[0].price.currency;
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState(initialCurrency);

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCurrencyChange = useCallback((rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  }, []);

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString();
  };

  const convertPrice = (price, fromCurrency) => {
    if (
      !exchangeRates ||
      !exchangeRates[fromCurrency] ||
      !exchangeRates[currency]
    ) {
      return price;
    }
    const rate = exchangeRates[currency] / exchangeRates[fromCurrency];
    return (price * rate).toFixed(2);
  };

  const handleBooking = async (flight) => {
    try {
      const response = await axios.post("/api/bookFlight", { flight });
      if (response.status === 200) {
        alert("Booking successful!");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error booking flight:", error);
      alert("An error occurred while booking the flight. Please try again.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 4, overflowY: "auto" }}>
      <CurrencyConverterGeneral
        onCurrencyChange={handleCurrencyChange}
        initialCurrency={initialCurrency}
      />
      <Grid container spacing={2} justifyContent="center">
        {flights.map((flight, index) => (
          <Grid
            item
            xs={12}
            sm={4}
            key={index}
            sx={{ mt: 2, overflowY: "auto" }}
          >
            <Card
              sx={{
                borderRadius: 5,
                width: "100%",
                height: "100%",
                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
                backgroundColor: "#f5f5f5",
              }}
            >
              <CardContent sx={{ padding: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ textAlign: "center", padding: 2 }}
                >
                  Flight {index + 1}
                </Typography>
                {flight.price && (
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ textAlign: "center", padding: 2 }}
                  >
                    Price:{" "}
                    {convertPrice(flight.price.total, flight.price.currency)}{" "}
                    {currency}
                  </Typography>
                )}
                {flight.itineraries &&
                  flight.itineraries[0] &&
                  flight.itineraries[0].segments &&
                  flight.itineraries[0].segments[0] && (
                    <Timeline position="left">
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          {formatDate(
                            flight.itineraries[0].segments[0].departure.at
                          )}{" "}
                          -{" "}
                          {formatTime(
                            flight.itineraries[0].segments[0].departure.at
                          )}
                          <br />
                          {flight.itineraries[0].segments[0].departure.iataCode}
                          ,{" "}
                          {flight.itineraries[0].segments[0].departure.terminal}
                          <br />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Departure</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          {formatDate(
                            flight.itineraries[0].segments[0].arrival.at
                          )}{" "}
                          -{" "}
                          {formatTime(
                            flight.itineraries[0].segments[0].arrival.at
                          )}
                          <br />
                          {
                            flight.itineraries[0].segments[0].arrival.iataCode
                          },{" "}
                          {flight.itineraries[0].segments[0].arrival.terminal}
                          <br />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                        </TimelineSeparator>
                        <TimelineContent>Arrival</TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBooking(flight)}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Book Flight Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlightsCards;
