import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Box, Typography, MenuItem, FormControl, InputLabel, Select , Autocomplete} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { message } from 'antd';
import TransportationsCards from './transportationsCards';
import { format } from 'date-fns';



function isDatePassed(enteredDate) {
  const currentDate = new Date(); // Get the current date and time
  const inputDate = new Date(enteredDate); // Convert the entered date to a Date object

  return inputDate < currentDate; // Returns true if the entered date is in the past
}

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

const TransportationBookingForm = () => {
  const[transportations, setTransportations] = useState([]);
  const[startLocationCode, setStartLocationCode] = useState(null);
  const[endAddressLine, setEndAddressLine] = useState(null);
  const[endCountryCode, setEndCountryCode] = useState(null);
  const[transferType, setTransferType] = useState(null);
  const[startDate, setStartDate] = useState(null);
  const[startTime, setStartTime] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);


  const validateFields = () => {
    if (!startLocationCode || !endAddressLine || !endCountryCode || !transferType || !startTime || !startDate) {
      message.error('Please fill in all required fields');
      return false;
    }
    if(isDatePassed(startDate)){
      message.error('This date has passed');
      return false;
    }
    
    return true;
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = format(newValue, 'yyyy-MM-dd');
      setStartDate(formattedDate);
    }
  };


  const handleSearch = async () =>{
    if(validateFields()){
      const dateTime = startDate+"T"+startTime;
      const requestBody ={
        startLocationCode : startLocationCode,
        //startLocationCode : origin.country,
        endAddressLine : endAddressLine,
        endCountryCode: endCountryCode,
        //endCountryCode: destination.country,
        transferType: transferType,
        startDateTime: dateTime
      }

      try{
        const response = await axios.post("http://localhost:8000/transportBook/transfer-offers",requestBody);
        const transportationData = response.data.data;

        if(response && transportationData.length >0){
          setTransportations(transportationData);

        }else {
          message.error('No Transportations found.');
        }

      }catch(error){
        console.error('Error fetching transportation:', error);
        message.error('Failed to fetch transportations. Please try again.');
      }
    }else {
      message.error('Error in the Form');
    }
  };

  

  return (
    <Container sx={{ maxHeight: '50vh', mt: -25, overflowY: 'visible' }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" style={{ textAlign: 'center' }} gutterBottom>
            Transportation Booking
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="start location code"
                value={startLocationCode}
                onChange={(e) => setStartLocationCode(e.target.value)}
                fullWidth
              />
            {/* <Autocomplete
              options={cities}
              getOptionLabel={(option) => `${option.country}, ${option.label}, ${option.code}`}
              value={origin}
              onChange={(event, newValue) => setOrigin(newValue)}
              renderInput={(params) => <TextField {...params} label="Origin City" fullWidth />}
            /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="end address"
                value={endAddressLine}
                onChange={(e) => setEndAddressLine(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="end country code"
                value={endCountryCode}
                onChange={(e) => setEndCountryCode(e.target.value)}
                fullWidth
              />
              {/* <Autocomplete
              options={cities}
              getOptionLabel={(option) => `${option.country}, ${option.label}, ${option.code}`}
              value={destination}
              onChange={(event, newValue) => setDestination(newValue)}
              renderInput={(params) => <TextField {...params} label="Destination City" fullWidth />}
              /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => handleDateChange(newValue)}
                 renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} >
          <FormControl fullWidth>
              <TextField
                label="Start Time: H:M:S"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
              />
          </FormControl>
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 1, // 1 second
                  }}
                  fullWidth
                />
              </LocalizationProvider> */}
            </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                  label="transportation type"
                >
                  <MenuItem value="PRIVATE">Private</MenuItem>
                  <MenuItem value="SHARED">Shared</MenuItem>
                  <MenuItem value="TAXI">Taxi</MenuItem>
                  <MenuItem value="HOURLY">Hourly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {transportations.length > 0 && <TransportationsCards sx={{overflowY: 'auto'}}transportations={transportations} />}
    </Container>
  );
};


export default TransportationBookingForm;
