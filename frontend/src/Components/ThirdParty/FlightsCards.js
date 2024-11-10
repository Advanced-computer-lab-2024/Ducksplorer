import React, { useState , useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import CurrencyConverterGeneral from './CurrencyConverterGeneral'; 
import { Button } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const FlightsCards = ({ flights , originCity, destinationCity, originCountry, destinationCountry }) => {
    const cities = [
        { label: 'New York', code: 'NYC', country: 'USA' },
        { label: 'Los Angeles', code: 'LAX', country: 'USA' },
        { label: 'Chicago', code: 'CHI', country: 'USA' },
        { label: 'Houston', code: 'HOU', country: 'USA' },
        { label: 'Phoenix', code: 'PHX', country: 'USA' },
        { label: 'Philadelphia', code: 'PHL', country: 'USA' },
        { label: 'San Francisco', code: 'SFO', country: 'USA' },
        { label: 'Indianapolis', code: 'IND', country: 'USA' },
        { label: 'Seattle', code: 'SEA', country: 'USA' },
        { label: 'Denver', code: 'DEN', country: 'USA' },
        { label: 'Washington', code: 'DCA', country: 'USA' },
        { label: 'London', code: 'LON', country: 'UK' },
        { label: 'Paris', code: 'PAR', country: 'France' },
        { label: 'Tokyo', code: 'TYO', country: 'Japan' },
        { label: 'Dubai', code: 'DXB', country: 'UAE' },
        { label: 'Singapore', code: 'SIN', country: 'Singapore' },
        { label: 'Sydney', code: 'SYD', country: 'Australia' },
        { label: 'Hong Kong', code: 'HKG', country: 'Hong Kong' },
        { label: 'Bangkok', code: 'BKK', country: 'Thailand' },
        { label: 'Toronto', code: 'YYZ', country: 'Canada' },
        { label: 'Vancouver', code: 'YVR', country: 'Canada' },
        { label: 'Mexico City', code: 'MEX', country: 'Mexico' },
        { label: 'São Paulo', code: 'GRU', country: 'Brazil' },
        { label: 'Buenos Aires', code: 'EZE', country: 'Argentina' },
        { label: 'Cape Town', code: 'CPT', country: 'South Africa' },
        { label: 'Johannesburg', code: 'JNB', country: 'South Africa' },
        { label: 'Moscow', code: 'MOW', country: 'Russia' },
        { label: 'Istanbul', code: 'IST', country: 'Turkey' },
        { label: 'Rome', code: 'ROM', country: 'Italy' },
        { label: 'Madrid', code: 'MAD', country: 'Spain' },
        { label: 'Berlin', code: 'BER', country: 'Germany' },
        { label: 'Amsterdam', code: 'AMS', country: 'Netherlands' },
        { label: 'Zurich', code: 'ZRH', country: 'Switzerland' },
        { label: 'Vienna', code: 'VIE', country: 'Austria' },
        { label: 'Athens', code: 'ATH', country: 'Greece' },
        { label: 'Lisbon', code: 'LIS', country: 'Portugal' },
        { label: 'Dublin', code: 'DUB', country: 'Ireland' },
        { label: 'Copenhagen', code: 'CPH', country: 'Denmark' },
        { label: 'Stockholm', code: 'ARN', country: 'Sweden' },
        { label: 'Oslo', code: 'OSL', country: 'Norway' },
        { label: 'Helsinki', code: 'HEL', country: 'Finland' },
        { label: 'Warsaw', code: 'WAW', country: 'Poland' },
        { label: 'Prague', code: 'PRG', country: 'Czech Republic' },
        { label: 'Budapest', code: 'BUD', country: 'Hungary' },
        { label: 'Brussels', code: 'BRU', country: 'Belgium' },
        { label: 'Munich', code: 'MUC', country: 'Germany' },
        { label: 'Frankfurt', code: 'FRA', country: 'Germany' },
        { label: 'Milan', code: 'MIL', country: 'Italy' },
        { label: 'Barcelona', code: 'BCN', country: 'Spain' },
        { label: 'Vienna', code: 'VIE', country: 'Austria' },
        { label: 'Kuala Lumpur', code: 'KUL', country: 'Malaysia' },
        { label: 'Jakarta', code: 'CGK', country: 'Indonesia' },
        { label: 'Manila', code: 'MNL', country: 'Philippines' },
        { label: 'Seoul', code: 'ICN', country: 'South Korea' },
        { label: 'Mumbai', code: 'BOM', country: 'India' },
        { label: 'Delhi', code: 'DEL', country: 'India' },
        { label: 'Shanghai', code: 'PVG', country: 'China' },
        { label: 'Beijing', code: 'PEK', country: 'China' },
        { label: 'Guangzhou', code: 'CAN', country: 'China' },
        { label: 'Cairo', code: 'CAI', country: 'Egypt' },
        { label: 'Alexandria', code: 'ALY', country: 'Egypt' },
        { label: 'Hurghada', code: 'HRG', country: 'Egypt' },
        { label: 'Sharm Al-Sheikh', code: 'SSH', country: 'Egypt' }
      ];

        const initialCurrency = flights[0].price.currency;
        const [exchangeRates, setExchangeRates] = useState({});
        const [currency, setCurrency] = useState(initialCurrency);
        const navigate = useNavigate();

        useEffect(() => {
            setCurrency(initialCurrency);
          }, [initialCurrency]);
        
          const formatTime = (datetime) => {
            const date = new Date(datetime);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[currency]) {
              return price;
            }
            const rate = exchangeRates[currency] / exchangeRates[fromCurrency];
            return (price * rate).toFixed(2);
          };

          //i want a function that converts the price to egp from euro
          const convertPriceToEgp = (price) => {
            if (!exchangeRates || !exchangeRates['EUR'] || !exchangeRates['EGP']) {
              return price;
            }
            const rate = exchangeRates['EGP'] / exchangeRates['EUR'];
            return (price * rate).toFixed(2);
          }
        const handleBooking = async (flightBooking) => {
            try {
              const userJson = localStorage.getItem('user');
              if (!userJson) {
                message.error("User is not logged in.");
                return null;
              }
              const user = JSON.parse(userJson);
              if (!user || !user.username) {
                message.error("User information is missing.");
                return null;
              }
              
              const departure = cities.find(city => city.code === flightBooking.itineraries[0].segments[0].departure.iataCode);
              console.log("departure",departure);
              const arrival = cities.find(city => city.code === flightBooking.itineraries[0].segments[0].arrival.iataCode);  
              console.log("arrival",arrival);
              
              
              const type = 'flight';
              const flight = {
                price: convertPriceToEgp(flightBooking.price.total),
                currency : 'EGP',
                departureDate : flightBooking.itineraries[0].segments[0].departure.at,
                arrivalDate : flightBooking.itineraries[0].segments[0].arrival.at,
                companyName : flightBooking.itineraries[0].segments[0].carrierCode,
                departureCity : originCity,
                departureCountry: originCountry,
                arrivalCountry : destinationCountry,
                arrivalCity : destinationCity,
              }
        
              localStorage.setItem('flight', JSON.stringify(flight));
              localStorage.setItem('type', type);
        
              
        
              if (flightBooking) {
                navigate('/payment');
              } else {
                message.error("Please Choose a flight.");
              }
            } catch (error) {
              console.error("Error:", error);
              message.error("An error occurred while booking.");
            }
   }
    

    return (
        <Box sx={{ flexGrow: 1, mt: 4, overflowY: 'auto' }}>
            <CurrencyConverterGeneral onCurrencyChange={handleCurrencyChange} initialCurrency={initialCurrency} />
            <Grid container spacing={2} justifyContent="center">
                {flights.map((flight, index) => (
                    <Grid item xs={12} sm={4} key={index} sx={{ mt: 2, overflowY: 'auto' }}>
                        <Card sx={{ borderRadius: 5, width: '100%', height: '100%' , boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', backgroundColor: '#f5f5f5'}}>
                            <CardContent sx={{ padding: 2 }}>
                                <Typography variant="h6" component="div" sx={{ textAlign: 'center', padding: 2 }}>
                                    Flight {index + 1}
                                </Typography>
                                {flight.price && (
                                    <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 2 }}>
                                        Price: {convertPrice(flight.price.total, flight.price.currency)} {currency}
                                    </Typography>
                                )}
                                {flight.itineraries && flight.itineraries[0] && flight.itineraries[0].segments && flight.itineraries[0].segments[0] && (
                                    <Timeline position="left">
                                        <TimelineItem>
                                            <TimelineOppositeContent color="text.secondary">
                                                {formatDate(flight.itineraries[0].segments[0].departure.at)} - {formatTime(flight.itineraries[0].segments[0].departure.at)}<br />
                                                {flight.itineraries[0].segments[0].departure.iataCode}, {flight.itineraries[0].segments[0].departure.terminal}<br />
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>Departure</TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent color="text.secondary">
                                                {formatDate(flight.itineraries[0].segments[0].arrival.at)} - {formatTime(flight.itineraries[0].segments[0].arrival.at)}<br />
                                                {flight.itineraries[0].segments[0].arrival.iataCode}, {flight.itineraries[0].segments[0].arrival.terminal}<br />
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot />
                                            </TimelineSeparator>
                                            <TimelineContent>Arrival</TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                )}
                                <Button variant="contained" color="primary" onClick={() => handleBooking(flight)} sx={{ mt: 2 }} fullWidth>
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