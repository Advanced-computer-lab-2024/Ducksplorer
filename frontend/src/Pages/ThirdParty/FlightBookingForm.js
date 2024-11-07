import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { message } from "antd";
import FlightsCards from "../../Components/ThirdParty/FlightsCards";

const cities = [
  { label: "New York", code: "NYC", country: "USA" },
  { label: "Los Angeles", code: "LAX", country: "USA" },
  { label: "Chicago", code: "CHI", country: "USA" },
  { label: "Houston", code: "HOU", country: "USA" },
  { label: "Phoenix", code: "PHX", country: "USA" },
  { label: "Philadelphia", code: "PHL", country: "USA" },
  { label: "San Francisco", code: "SFO", country: "USA" },
  { label: "Indianapolis", code: "IND", country: "USA" },
  { label: "Seattle", code: "SEA", country: "USA" },
  { label: "Denver", code: "DEN", country: "USA" },
  { label: "Washington", code: "DCA", country: "USA" },
  { label: "London", code: "LON", country: "UK" },
  { label: "Paris", code: "PAR", country: "France" },
  { label: "Tokyo", code: "TYO", country: "Japan" },
  { label: "Dubai", code: "DXB", country: "UAE" },
  { label: "Singapore", code: "SIN", country: "Singapore" },
  { label: "Sydney", code: "SYD", country: "Australia" },
  { label: "Hong Kong", code: "HKG", country: "Hong Kong" },
  { label: "Bangkok", code: "BKK", country: "Thailand" },
  { label: "Toronto", code: "YYZ", country: "Canada" },
  { label: "Vancouver", code: "YVR", country: "Canada" },
  { label: "Mexico City", code: "MEX", country: "Mexico" },
  { label: "São Paulo", code: "GRU", country: "Brazil" },
  { label: "Buenos Aires", code: "EZE", country: "Argentina" },
  { label: "Cape Town", code: "CPT", country: "South Africa" },
  { label: "Johannesburg", code: "JNB", country: "South Africa" },
  { label: "Moscow", code: "MOW", country: "Russia" },
  { label: "Istanbul", code: "IST", country: "Turkey" },
  { label: "Rome", code: "ROM", country: "Italy" },
  { label: "Madrid", code: "MAD", country: "Spain" },
  { label: "Berlin", code: "BER", country: "Germany" },
  { label: "Amsterdam", code: "AMS", country: "Netherlands" },
  { label: "Zurich", code: "ZRH", country: "Switzerland" },
  { label: "Vienna", code: "VIE", country: "Austria" },
  { label: "Athens", code: "ATH", country: "Greece" },
  { label: "Lisbon", code: "LIS", country: "Portugal" },
  { label: "Dublin", code: "DUB", country: "Ireland" },
  { label: "Copenhagen", code: "CPH", country: "Denmark" },
  { label: "Stockholm", code: "ARN", country: "Sweden" },
  { label: "Oslo", code: "OSL", country: "Norway" },
  { label: "Helsinki", code: "HEL", country: "Finland" },
  { label: "Warsaw", code: "WAW", country: "Poland" },
  { label: "Prague", code: "PRG", country: "Czech Republic" },
  { label: "Budapest", code: "BUD", country: "Hungary" },
  { label: "Brussels", code: "BRU", country: "Belgium" },
  { label: "Munich", code: "MUC", country: "Germany" },
  { label: "Frankfurt", code: "FRA", country: "Germany" },
  { label: "Milan", code: "MIL", country: "Italy" },
  { label: "Barcelona", code: "BCN", country: "Spain" },
  { label: "Vienna", code: "VIE", country: "Austria" },
  { label: "Kuala Lumpur", code: "KUL", country: "Malaysia" },
  { label: "Jakarta", code: "CGK", country: "Indonesia" },
  { label: "Manila", code: "MNL", country: "Philippines" },
  { label: "Seoul", code: "ICN", country: "South Korea" },
  { label: "Mumbai", code: "BOM", country: "India" },
  { label: "Delhi", code: "DEL", country: "India" },
  { label: "Shanghai", code: "PVG", country: "China" },
  { label: "Beijing", code: "PEK", country: "China" },
  { label: "Guangzhou", code: "CAN", country: "China" },
  { label: "Cairo", code: "CAI", country: "Egypt" },
  { label: "Alexandria", code: "ALY", country: "Egypt" },
  { label: "Hurghada", code: "HRG", country: "Egypt" },
  { label: "Sharm Al-Sheikh", code: "SSH", country: "Egypt" },
];

const FlightBookingForm = () => {
  const [flights, setFlights] = useState([]);
  const [departureDate, setDepartureDate] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [seats, setSeats] = useState("");

  const handleSearch = async () => {
    if (validateFields()) {
      const formattedDepartureDate = departureDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const requestBody = {
        originCode: origin.code,
        destinationCode: destination.code,
        dateOfDeparture: formattedDepartureDate,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/flight-search",
          requestBody
        );
        const flightsData = response.data.data;
        console.log(flightsData);

        if (flightsData && flightsData.length > 0) {
          setFlights(flightsData);
          console.log(flightsData[0].itineraries[0]);
          console.log(flightsData[0].itineraries[0].segments[0].arrival.at);
        } else {
          message.error("No flights found.");
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
        message.error("Response data:", error.response.data.error);
        message.error("Failed to fetch flights. Please try again.");
      }
    } else {
      message.error("Error in the Form");
    }
  };

  const validateFields = () => {
    if (!departureDate || !origin || !destination || !seats) {
      message.error("Please fill in all required fields");
      return false;
    } else if (departureDate < new Date()) {
      message.error("Departure date cannot be in the past");
      return false;
    } else if (origin === destination) {
      message.error("Origin and destination cannot be the same");
      return false;
    } else if (seats < 1) {
      message.error("Number of seats must be greater than 0");
      return false;
    }
    return true;
  };

  return (
    <Container sx={{ maxHeight: "50vh", mt: -25, overflowY: "visible" }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" style={{ textAlign: "center" }} gutterBottom>
            Flight Booking
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) =>
                  `${option.country}, ${option.label}, ${option.code}`
                }
                value={origin}
                onChange={(event, newValue) => setOrigin(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Origin" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) =>
                  `${option.country}, ${option.label}, ${option.code}`
                }
                value={destination}
                onChange={(event, newValue) => setDestination(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Destination" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Seats"
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                fullWidth
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {flights.length > 0 && (
        <FlightsCards
          sx={{ overflowY: "auto" }}
          flights={flights}
          origin={origin}
          destination={destination}
          departureDate={departureDate}
        />
      )}
    </Container>
  );
};

export default FlightBookingForm;
