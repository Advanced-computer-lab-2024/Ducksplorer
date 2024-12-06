import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";

function isDatePassed(enteredDate) {
  const currentDate = new Date(); // Get the current date and time
  const inputDate = new Date(enteredDate); // Convert the entered date to a Date object

  return inputDate < currentDate; // Returns true if the entered date is in the past
}

const airports = [
  {
    label: "Hartsfield-Jackson Atlanta International Airport",
    code: "ATL",
    country: "USA",
    countryCode: "USA",
  },
  {
    label: "Beijing Capital International Airport",
    code: "PEK",
    country: "China",
    countryCode: "CHN",
  },
  {
    label: "Los Angeles International Airport",
    code: "LAX",
    country: "USA",
    countryCode: "USA",
  },
  {
    label: "Dubai International Airport",
    code: "DXB",
    country: "UAE",
    countryCode: "ARE",
  },
  {
    label: "Tokyo Haneda Airport",
    code: "HND",
    country: "Japan",
    countryCode: "JPN",
  },
  {
    label: "O'Hare International Airport",
    code: "ORD",
    country: "USA",
    countryCode: "USA",
  },
  {
    label: "London Heathrow Airport",
    code: "LHR",
    country: "UK",
    countryCode: "GBR",
  },
  {
    label: "Hong Kong International Airport",
    code: "HKG",
    country: "Hong Kong",
    countryCode: "HKG",
  },
  {
    label: "Shanghai Pudong International Airport",
    code: "PVG",
    country: "China",
    countryCode: "CHN",
  },
  {
    label: "Paris Charles de Gaulle Airport",
    code: "CDG",
    country: "France",
    countryCode: "FR",
  },
  {
    label: "Dallas/Fort Worth International Airport",
    code: "DFW",
    country: "USA",
    countryCode: "USA",
  },
  {
    label: "Amsterdam Schiphol Airport",
    code: "AMS",
    country: "Netherlands",
    countryCode: "NLD",
  },
  {
    label: "Frankfurt Airport",
    code: "FRA",
    country: "Germany",
    countryCode: "DEU",
  },
  {
    label: "Istanbul Airport",
    code: "IST",
    country: "Turkey",
    countryCode: "TUR",
  },
  {
    label: "Singapore Changi Airport",
    code: "SIN",
    country: "Singapore",
    countryCode: "SGP",
  },
  {
    label: "Incheon International Airport",
    code: "ICN",
    country: "South Korea",
    countryCode: "KOR",
  },
  {
    label: "Guangzhou Baiyun International Airport",
    code: "CAN",
    country: "China",
    countryCode: "CHN",
  },
  {
    label: "Denver International Airport",
    code: "DEN",
    country: "USA",
    countryCode: "USA",
  },
  {
    label: "Soekarno-Hatta International Airport",
    code: "CGK",
    country: "Indonesia",
    countryCode: "IDN",
  },
  {
    label: "Suvarnabhumi Airport",
    code: "BKK",
    country: "Thailand",
    countryCode: "THA",
  },
  {
    label: "Barcelona-El Prat Airport",
    code: "BCN",
    country: "Spain",
    countryCode: "ESP",
  },
  {
    label: "Toronto Pearson International Airport",
    code: "YYZ",
    country: "Canada",
    countryCode: "CAN",
  },
  {
    label: "Sydney Kingsford Smith Airport",
    code: "SYD",
    country: "Australia",
    countryCode: "AUS",
  },
  {
    label: "São Paulo-Guarulhos International Airport",
    code: "GRU",
    country: "Brazil",
    countryCode: "BRA",
  },
  {
    label: "Madrid-Barajas Airport",
    code: "MAD",
    country: "Spain",
    countryCode: "ESP",
  },
  {
    label: "Mexico City International Airport",
    code: "MEX",
    country: "Mexico",
    countryCode: "MEX",
  },
  {
    label: "Miami International Airport",
    code: "MIA",
    country: "USA",
    countryCode: "USA",
  },
  {
    label: "Narita International Airport",
    code: "NRT",
    country: "Japan",
    countryCode: "JPN",
  },
  {
    label: "Rome Fiumicino Airport",
    code: "FCO",
    country: "Italy",
    countryCode: "ITA",
  },
  {
    label: "Munich Airport",
    code: "MUC",
    country: "Germany",
    countryCode: "DEU",
  },
  {
    label: "Zurich Airport",
    code: "ZRH",
    country: "Switzerland",
    countryCode: "CHE",
  },
  {
    label: "Vienna International Airport",
    code: "VIE",
    country: "Austria",
    countryCode: "AUT",
  },
  {
    label: "Lisbon Humberto Delgado Airport",
    code: "LIS",
    country: "Portugal",
    countryCode: "PRT",
  },
  {
    label: "Dublin Airport",
    code: "DUB",
    country: "Ireland",
    countryCode: "IRL",
  },
  {
    label: "Copenhagen Airport",
    code: "CPH",
    country: "Denmark",
    countryCode: "DNK",
  },
  {
    label: "Stockholm Arlanda Airport",
    code: "ARN",
    country: "Sweden",
    countryCode: "SWE",
  },
  {
    label: "Oslo Gardermoen Airport",
    code: "OSL",
    country: "Norway",
    countryCode: "NOR",
  },
  {
    label: "Helsinki-Vantaa Airport",
    code: "HEL",
    country: "Finland",
    countryCode: "FIN",
  },
  {
    label: "Brussels Airport",
    code: "BRU",
    country: "Belgium",
    countryCode: "BEL",
  },
  {
    label: "Vienna International Airport",
    code: "VIE",
    country: "Austria",
    countryCode: "AUT",
  },
  {
    label: "Athens International Airport",
    code: "ATH",
    country: "Greece",
    countryCode: "GRC",
  },
  {
    label: "Budapest Ferenc Liszt International Airport",
    code: "BUD",
    country: "Hungary",
    countryCode: "HUN",
  },
  {
    label: "Johannesburg OR Tambo International Airport",
    code: "JNB",
    country: "South Africa",
    countryCode: "ZAF",
  },
  {
    label: "Cape Town International Airport",
    code: "CPT",
    country: "South Africa",
    countryCode: "ZAF",
  },
  {
    label: "Moscow Sheremetyevo International Airport",
    code: "SVO",
    country: "Russia",
    countryCode: "RUS",
  },
  {
    label: "Cairo International Airport",
    code: "CAI",
    country: "Egypt",
    countryCode: "EGY",
  },
  {
    label: "Vienna International Airport",
    code: "VIE",
    country: "Austria",
    countryCode: "AUT",
  },
  {
    label: "Kuala Lumpur International Airport",
    code: "KUL",
    country: "Malaysia",
    countryCode: "MYS",
  },
  {
    label: "Manila Ninoy Aquino International Airport",
    code: "MNL",
    country: "Philippines",
    countryCode: "PHL",
  },
  {
    label: "Mumbai Chhatrapati Shivaji Maharaj International Airport",
    code: "BOM",
    country: "India",
    countryCode: "IND",
  },
  {
    label: "Delhi Indira Gandhi International Airport",
    code: "DEL",
    country: "India",
    countryCode: "IND",
  },
];

const TransportationBookingForm = () => {
  const [transportations, setTransportations] = useState([]);
  const [startLocationCode, setStartLocationCode] = useState(null);
  const [endAddressLine, setEndAddressLine] = useState(null);
  const [endCountryCode, setEndCountryCode] = useState(null);
  const [transferType, setTransferType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTimeChange = (newTime) => {
    if (newTime) {
      const formattedTime = newTime.toISOString().substr(11, 8); // Converts to HH:MM:SS
      setStartTime(formattedTime);
    }
  };

  const validateFields = () => {
    if (
      !startLocationCode ||
      !endAddressLine ||
      !endCountryCode ||
      !transferType ||
      !startTime ||
      !startDate
    ) {
      message.error("Please fill in all required fields");
      return false;
    }
    if (isDatePassed(startDate)) {
      message.error("This date has passed");
      return false;
    }

    return true;
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = format(newValue, "yyyy-MM-dd");
      setStartDate(formattedDate);
    }
  };

  const handleSearch = async () => {
    if (validateFields()) {
      setLoading(true);
      const dateTime = startDate + "T" + startTime;
      const requestBody = {
        startLocationCode: startLocationCode,
        endAddressLine: endAddressLine,
        endCountryCode: endCountryCode,
        transferType: transferType,
        startDateTime: dateTime,
      };

      try {
        console.log(requestBody);
        const response = await axios.post(
          "http://localhost:8000/transportBook/transfer-offers",
          requestBody
        );
        const transportationData = response.data.data;

        if (transportationData.length > 0) {
          const transportationsDataToStore = {
            transportations: transportationData,
            startLocationCode,
            endAddressLine,
            endCountryCode,
            transferType,
            startDateTime: dateTime,
          };
          localStorage.setItem(
            "transportationsData",
            JSON.stringify(transportationsDataToStore)
          );
          navigate("/transportationsPage");
        } else {
          message.error("No Transportations found.");
        }
      } catch (error) {
        console.error("Error fetching transportation:", error);
        message.error(
          "No Transportations available for this address at this time"
        );
      } finally {
        setLoading(false);
      }
    } else {
      message.error("Error in the Form");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <Typography variant="h3" style={styles.welcomeText}>
          Transportation Booking
        </Typography>
        <Typography variant="h5" style={styles.descriptionText}>
          Book your transportation with ease.
        </Typography>
      </div>
      <div style={styles.rightSection}>
        <Container maxWidth="sm" style={{ marginTop: "-30vh" }}>
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h4"
              style={{ textAlign: "center" ,  marginBottom: "60px"}}
              gutterBottom
            >
              Transportation Booking
            </Typography>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <Autocomplete
                  options={airports}
                  getOptionLabel={(option) =>
                    `${option.country}, ${option.label}, ${option.code}`
                  }
                  value={
                    airports.find(
                      (airport) => airport.code === startLocationCode
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setStartLocationCode(newValue ? newValue.code : ""); // Set the start location code
                    setEndCountryCode(newValue ? newValue.countryCode : ""); // Set the end country code
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Airport" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="End Address"
                  value={endAddressLine}
                  onChange={(e) => setEndAddressLine(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => handleDateChange(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Start Time: H:M:S"
                      value={
                        startTime ? new Date(`1970-01-01T${startTime}Z`) : null
                      } // Initialize the value
                      onChange={handleTimeChange} // Handle time change
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
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
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#ff9933", color: "white" }}
                  onClick={handleSearch}
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress sx={{ color: "#ff9933" }} size={24} /> : "Search"}
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
    height: "100vh",
    width: "100vw",
    background: 'url("/duckBus.jpg") no-repeat left center fixed',
    backgroundSize:"cover"
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
  centeredSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  welcomeText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  descriptionText: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
};

export default TransportationBookingForm;
