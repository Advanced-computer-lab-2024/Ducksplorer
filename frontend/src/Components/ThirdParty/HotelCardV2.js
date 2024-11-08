import React from 'react';
import { Card, CardMedia, Typography, Box, Button, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const HotelCardV2 = () => {
  return (
    <Card sx={{ display: 'flex', margin: '20px auto', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: 800 }}>
      <CardMedia
        component="img"
        sx={{ width: 200, borderRadius: '15px 0 0 15px' }}
        image="https://example.com/kempinski.jpg" // Replace with actual image URL
        alt="Kempinski Hotel"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', padding: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" gutterBottom>
            Kempinski Hotel
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <Button variant="contained" color="primary">
            Book Now
          </Button>
          <Divider orientation="vertical" flexItem sx={{ margin: '0 20px', height: '100%' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', padding: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <LocationOnIcon sx={{ color: 'gray', marginRight: '5px' }} />
              <Typography variant="body2" color="text.secondary">
                Berlin, Germany
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              2 km from city center
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Price: 200 USD
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <StarIcon sx={{ color: 'gold' }} />
              <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '5px' }}>
                4.5 (1200 reviews)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default HotelCardV2;
