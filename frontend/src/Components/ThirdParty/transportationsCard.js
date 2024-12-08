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

const TransportationsCard = ({ transportations }) => {
  const handleBooking = async (transportation) => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }
      const dob = user.dob;
      console.log("dob", dob);
      if (!isUser18OrOlder(dob)) {
        message.error("You must be at least 18 years old to book a hotel.");
        return;
      }
      const response = await axios.put(
        "http://localhost:8000/transportBook/transportation-booking",
        { transportation }
      );
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
      {/* <CurrencyConverterGeneral onCurrencyChange={handleCurrencyChange} initialCurrency={initialCurrency} /> */}
      <Grid container spacing={2} justifyContent="center">
        {transportations.map((transportation, index) => (
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
                  Transportation {index + 1}
                </Typography>
                {transportation.quotation.monetaryAmount}
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
