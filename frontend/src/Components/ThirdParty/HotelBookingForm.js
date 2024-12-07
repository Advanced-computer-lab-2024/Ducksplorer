import React, { useState , useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { message } from "antd";
import HotelCards from "./HotelCard";
import { useNavigate } from "react-router-dom";
import DuckLoading from "../Loading/duckLoading";

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
  { label: "Hurghada ", code: "HRG", country: "Egypt" },
  { label: "Sharm El Sheikh", code: "SSH", country: "Egypt" },
  { label: "Luxor", code: "LXR", country: "Egypt" },
  { label: "Monaco", code: "MCM", country: "Monaco" },
];

const HotelBookingForm = () => {
  const [hotels, setHotels] = useState([]);
  const [checkInDate, setCheckInDate] = useState(null);
  const [city, setCity] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [adults, setAdults] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (validateFields()) {
      setLoading(true);
      const formattedCheckInDate = checkInDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const formattedCheckOutDate = checkOutDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd

      try {
        const query = `${city.label},${city.country}`; // Outputs 'Cairo,Egypt'
        const encodedQuery = encodeURIComponent(query); // Outputs 'Cairo%2CEgypt'
        console.log(encodedQuery);
        const locationResponse = await axios.get(
          `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${encodedQuery}`,
          {
            headers: {
              "x-rapidapi-key":
                "c7ca2a8100mshd130920df3324d6p1981b5jsnd001bc3dd180",
              "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
            },
          }
        );
        console.log(locationResponse);

        if (
          locationResponse.status === 200 &&
          locationResponse.data.data.length > 0
        ) {
          const geoId = locationResponse.data.data[0].geoId;

          const hotelsResponse = await axios.get(
            `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels`,
            {
              params: {
                geoId: geoId,
                checkIn: formattedCheckInDate,
                checkOut: formattedCheckOutDate,
                adults: adults,
              },
              headers: {
                "x-rapidapi-key":
                  "c7ca2a8100mshd130920df3324d6p1981b5jsnd001bc3dd180",
                "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
              },
            }
          );

          if (hotelsResponse.status === 200) {
            const hotelsData = hotelsResponse.data.data.data;
            console.log(hotelsData);

            if (hotelsData && hotelsData.length > 0) {
              const hotelsDataToStore = {
                hotels: hotelsData,
                checkInDate,
                checkOutDate,
                city: city.label,
                country: city.country,
                adults,
              };
              localStorage.setItem(
                "hotelsData",
                JSON.stringify(hotelsDataToStore)
              );
              navigate("/hotelsPage");
            } else {
              message.error("No Hotels found.");
            }
          } else {
            message.error("Failed to fetch Hotels. Please try again.");
          }
        } else {
          message.error(
            "No hotels found in the specified location. Please try again."
          );
        }
      } catch (error) {
        console.error("Error fetching Hotels:", error);
        message.error("Failed to fetch Hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      message.error("Error in the Form");
    }
  };

  const validateFields = () => {
    if (!checkInDate || !checkOutDate || !city || !adults) {
      message.error("Please fill in all required fields");
      return false;
    } else if (checkInDate < new Date()) {
      message.error("Check-in date cannot be in the past");
      return false;
    } else if (checkOutDate < checkInDate) {
      message.error("Check-out date cannot be before check-in date");
      return false;
    } else if (adults < 1) {
      message.error("Number of adults must be greater than 0");
      return false;
    }
    return true;
  };

 
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

 

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <Typography variant="h3" className="duckTitle" style={styles.welcomeText}>
          Hotel Booking
        </Typography>
      </div>
      <div style={styles.rightSection}>
        <Container maxWidth="sm" style={{ marginTop: "-30vh" }}>
          <Box>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "60px" }}
              gutterBottom
            >
              Hotel Booking
            </Typography>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Check-in Date"
                    value={checkInDate}
                    onChange={(newValue) => setCheckInDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Check-out Date"
                    value={checkOutDate}
                    sx={{ width: "100%" }}
                    onChange={(newValue) => setCheckOutDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) =>
                    `${option.country}, ${option.label}, ${option.code}`
                  }
                  value={city}
                  onChange={(event, newValue) => setCity(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="City" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Number of Adults"
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#ff9933", marginTop: "20px" }}
                  onClick={handleSearch}
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress sx={{ color: "#ffcc99" }} size={24} />
                  ) : (
                    "Search"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "120vh",
    width: "100vw",
    background: 'url("/duckHotel.jpg") no-repeat left center fixed',
    backgroundSize: "cover",
    overflowY: "visible",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "20px",
  },
  rightSection: {
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
    position: "fixed",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default HotelBookingForm;
