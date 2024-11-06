import React, { useState , useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import CurrencyConverterGeneral from './CurrencyConverterGeneral'; 
import { Button } from '@mui/material';
import axios from 'axios';


const TransportationsCards = ({transportations}) => {

  

  const handleBooking = async(transportation) => {
    try {
      const response = await axios.post('http://localhost:8000/transportBook/transportation-booking', { transportation });
      if (response.status === 200) {
          alert('Booking successful!');
      } else {
          alert('Booking failed. Please try again.');
      }
    }catch(error){
      console.error('Error booking transportation:', error);
      alert('An error occurred while booking the transportation. Please try again.');
    }
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 4, overflowY: 'auto' }}>
        <Grid container spacing={2} justifyContent="center">
            {transportations.map((transportation, index) => (
                <Grid item xs={12} sm={4} key={index} sx={{ mt: 2, overflowY: 'auto' }}>
                    <Card sx={{ borderRadius: 5, width: '100%', height: '100%', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', backgroundColor: '#f5f5f5' }}>
                        <CardContent sx={{ padding: 2 }}>
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', padding: 2 }}>
                                Transportation {index + 1}
                            </Typography>
                            
                            {/* Arrival Time */}
                            {transportation.end && transportation.end.dateTime && (
                                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 1 }}>
                                    Arrival Time: {new Date(transportation.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            )}

                            {/* Transfer Type */}
                            {transportation.transferType && (
                                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 1 }}>
                                    Transfer Type: {transportation.transferType}
                                </Typography>
                            )}

                            {/* Vehicle Description and Picture */}
                            {transportation.vehicle && (
                                <>
                                    <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 1 }}>
                                        Description: {transportation.vehicle.description}
                                    </Typography>
                                    {transportation.vehicle.imageURL && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
                                            <img src={transportation.vehicle.imageURL} alt="Vehicle" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                                        </Box>
                                    )}
                                </>
                            )}

                            {/* Seats */}
                            {transportation.vehicle && transportation.vehicle.seats && (
                                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 1 }}>
                                    Seats: {transportation.vehicle.seats[0].count}
                                </Typography>
                            )}

                            {/* Price */}
                            {transportation.quotation && transportation.quotation.monetaryAmount && (
                                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 1 }}>
                                    Price: {transportation.quotation.monetaryAmount}$
                                </Typography>
                            )}

                            {/* Service Provider Logo and Name */}
                            {transportation.serviceProvider && (
                                <>
                                    <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', padding: 1 }}>
                                        Service Provider: {transportation.serviceProvider.name}
                                    </Typography>
                                    {transportation.serviceProvider.logoUrl && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
                                            <img src={transportation.serviceProvider.logoUrl} alt="Service Provider Logo" style={{ maxWidth: '100px', maxHeight: '50px' }} />
                                        </Box>
                                    )}
                                </>
                            )}
                            
                            <Button variant="contained" color="primary" onClick={() => handleBooking(transportation)} sx={{ mt: 2 }} fullWidth>
                                Book Transportation
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Box>
);

};


export default TransportationsCards;