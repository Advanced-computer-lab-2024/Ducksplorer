import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Rating,
  Tooltip,
  IconButton,
  Tab,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MyChips from "../../Components/MyChips";
import DeleteIcon from "@mui/icons-material/Delete";
import { message } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import { Link } from "react-router-dom";
import TouristSidebar from "../../Components/Sidebars/TouristSidebar";
import DuckLoading from "../../Components/Loading/duckLoading";
import Error404 from "../../Components/Error404";

const BookingDetails = () => {
  const userName = JSON.parse(localStorage.getItem("user")).username;
  //const [booking, setBooking] = useState(null);
  const [exchangeRatesAc, setExchangeRatesAc] = useState({});
  const [currencyAc, setCurrencyAc] = useState("EGP");
  const [exchangeRatesIt, setExchangeRatesIt] = useState({});
  const [currencyIt, setCurrencyIt] = useState("EGP");
  const [exchangeRatesft, setExchangeRatesft] = useState({});
  const [currencyft, setCurrencyft] = useState("EGP");
  const [exchangeRatesht, setExchangeRatesht] = useState({});
  const [currencyht, setCurrencyht] = useState("EGP");
  const [exchangeRatestt, setExchangeRatestt] = useState({});
  const [currencytt, setCurrencytt] = useState("EGP");
  const [activityBookings, setActivityBookings] = useState([]);
  const [itineraryBookings, setItineraryBookings] = useState([]);
  const [flightsBookings, setFlightsBookings] = useState([]);
  const [hotelsBookings, setHotelsBookings] = useState([]);
  const [transportationBookings, setTransportationBookings] = useState([]);
  //const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = localStorage.getItem("guest") === "true";
  const navigate = useNavigate();
  const [tourGuideNames, setTourGuideNames] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const chipNames = [
    "Past",
    "All",
    "Activities",
    "Hotels",
    "Itineraries",
    "Flights",
    "Transportation",
  ];

  const errorMessage =
    "The bookings you are looking for might be removed or is temporarily unavailable";
  const backMessage = "BACK TO TOURIST DASHBOARD";

  useEffect(() => {
    if (selectedCategory === "Past") {
      navigate("/myPastBookings");
    }
  }, [selectedCategory, navigate]);

  const handleChipClick = (chipName) => {
    setSelectedCategory(chipName);
  };

  const fetchTourGuideName = async (bookingId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/tourGuideRate/getUserNameById/${bookingId}`
      );
      console.log("Tour Guide Name Response:", response.data);
      return response.data.userName;
    } catch (error) {
      console.error("Error fetching tour guide name:", error.message);
      return "N/A";
    }
  };

  const handleCurrencyChangeAc = (rates, selectedCurrency) => {
    setExchangeRatesAc(rates);
    setCurrencyAc(selectedCurrency);
  };

  const handleCurrencyChangeIt = (rates, selectedCurrency) => {
    setExchangeRatesIt(rates);
    setCurrencyIt(selectedCurrency);
  };

  const handleCurrencyChangeft = (rates, selectedCurrency) => {
    setExchangeRatesft(rates);
    setCurrencyft(selectedCurrency);
  };

  const handleCurrencyChangeht = (rates, selectedCurrency) => {
    setExchangeRatesht(rates);
    setCurrencyht(selectedCurrency);
  };

  const handleCurrencyChangett = (rates, selectedCurrency) => {
    setExchangeRatestt(rates);
    setCurrencytt(selectedCurrency);
  };
  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/touristRoutes/booking`,
        {
          params: { tourist: userName },
        }
      );

      // Set activity and itinerary bookings separately
      setActivityBookings(response.data.activities || []);
      setItineraryBookings(response.data.itineraries || []);
      console.log(response.data);
      setFlightsBookings(response.data.flights || []);
      setHotelsBookings(response.data.hotels || []);
      console.log("HotelsData", response.data.hotels);
      setTransportationBookings(response.data.transportations || []);
      // setCurrencyft(response.data.flights[0].currency);
      console.log(response.data);
      const tourGuideNamesMap = {};
      for (const itineraryBooking of response.data.itineraries) {
        const tourGuideName = await fetchTourGuideName(itineraryBooking._id);
        tourGuideNamesMap[itineraryBooking._id] = tourGuideName;
      }
      setTourGuideNames(tourGuideNamesMap);
    } catch (error) {
      console.error(
        "Error fetching booking details:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setTimeout(() => setLoading(false), 1000); // Delay of 1 second
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (type, itemId, price, booking) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/touristRoutes/booking/${userName}`,
        {
          type,
          itemId,
          price,
          booking,
        }
      );

      if (response.status === 200) {
        message.success("Booking Canceled");

        // Update state immediately to remove the item locally
        if (type === "activity") {
          setActivityBookings((prev) =>
            prev.filter((activity) => activity._id !== itemId)
          );
        } else if (type === "itinerary") {
          setItineraryBookings((prev) =>
            prev.filter((itinerary) => itinerary._id !== itemId)
          );
        }
        await fetchBookings();
        // Re-fetch bookings to ensure the state is in sync with the server
        //fetchBookings();
      } else {
        message.error(
          response.data.message || "Failed to delete booking item."
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error(
        error.response?.data?.message ||
        "Cannot cancel the booking within 48 hours of the start date or after the start of the activity/itinerary."
      );
    }
  };

  const handleDeleteThirdPartyBooking = async (type, price, booking) => {
    try {
      console.log("BookingID", booking);
      const response = await axios.patch(
        `http://localhost:8000/touristRoutes/booking/${userName}`,
        {
          type,
          price,
          booking,
        }
      );

      if (response.status === 200) {
        message.success("Booking Canceled");

        // Update state immediately to remove the item locally
        if (type === "flight") {
          setFlightsBookings((prev) =>
            prev.filter((flight) => flight.id !== booking)
          );
        } else if (type === "hotel") {
          setHotelsBookings((prev) =>
            prev.filter((hotel) => hotel.id !== booking)
          );
        } else if (type === "transportation") {
          setTransportationBookings((prev) =>
            prev.filter((transportation) => transportation.id !== booking)
          );
        }

        // Re-fetch bookings to ensure the state is in sync with the server
        fetchBookings();
      } else {
        message.error(
          response.data.message || "Failed to delete booking item."
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error(
        error.response?.data?.message ||
        "Cannot cancel the booking within 48 hours of the start date or after the start of the activity/itinerary."
      );
    }
  };

  if (loading) {
    return (
      <div>
        <DuckLoading />
      </div>
    );
  }

  if (
    activityBookings.length === 0 &&
    itineraryBookings.length === 0 &&
    flightsBookings.length === 0 &&
    hotelsBookings.length === 0 &&
    transportationBookings.length === 0
  )
    return (
      <>
        <TouristNavBar />
        <Error404
          errorMessage={errorMessage}
          backMessage={backMessage}
          route="/touristDashboard"
        />
      </>
    );

  return (
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
        width: "90vw",
        marginLeft: "5vw",
      }}
    >
      <TouristNavBar />

      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
      >
        <div style={{ overflowY: "visible", height: "100vh" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold", paddingTop: "5%" }}
            gutterBottom
          >
            Booking Details
          </Typography>
          <br></br>
          <MyChips chipNames={chipNames} onChipClick={handleChipClick} />
          {/* Activities Table */}
          {(selectedCategory === "Activities" ||
            selectedCategory === "All") && (
              <div>
                {" "}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginBottom: "20px" }}
                  gutterBottom
                >
                  Activities
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    marginBottom: 4,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    borderRadius: "1.5cap",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Is Open
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Advertiser
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Location
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Price
                          <CurrencyConvertor
                            onCurrencyChange={handleCurrencyChangeAc}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Category
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Tags
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Special Discount
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Duration
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Average Rating
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityBookings.map((activityBooking) => (
                        <TableRow key={activityBooking._id}>
                          <TableCell>
                            {activityBooking.activity?.name || "No Name"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.isOpen ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.advertiser || "N/A"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.date
                              ? new Date(
                                activityBooking.activity.date
                              ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.location || "N/A"}
                          </TableCell>
                          <TableCell>
                            {(
                              activityBooking.activity?.price *
                              (exchangeRatesAc[currencyAc] || 1)
                            ).toFixed(2)}{" "}
                            {currencyAc}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.category || "N/A"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.tags?.join(", ") ||
                              "No tags available"}
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.specialDiscount || 0}%
                          </TableCell>
                          <TableCell>
                            {activityBooking.activity?.duration || "N/A"} mins
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={activityBooking.activity?.averageRating || 0}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Cancel Booking">
                              <IconButton
                                color="error"
                                aria-label="delete category"
                                onClick={() =>
                                  handleDeleteBooking(
                                    "activity",
                                    activityBooking.activity?._id,
                                    activityBooking.activity?.price
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>{" "}
              </div>
            )}
          {/* Itineraries Table */}
          {(selectedCategory === "Itineraries" ||
            selectedCategory === "All") && (
              <div>
                {" "}
                <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
                  Itineraries
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    marginBottom: 4,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    borderRadius: "1.5cap",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Activity Names
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Language
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Price
                          <CurrencyConvertor
                            onCurrencyChange={handleCurrencyChangeIt}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Available Dates & Times
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Chosen Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Pick-Up Location
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Drop-Off Location
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Tour Guide
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Average Rating
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Tags
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itineraryBookings.map((itineraryBooking) => (
                        <TableRow key={itineraryBooking._id}>
                          <TableCell>
                            {itineraryBooking.itinerary?.name ||
                              "Still doesn't have a name"}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.activity
                              ? itineraryBooking.itinerary.activity
                                .map((act) => act.name)
                                .join(", ")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {" "}
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.language
                              ? itineraryBooking.itinerary.language
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              itineraryBooking.chosenPrice
                              ? (
                                itineraryBooking.chosenPrice *
                                (exchangeRatesIt[currencyIt] || 1)
                              ).toFixed(2) + ` ${currencyIt}`
                              : "N/A"}{" "}
                          </TableCell>
                          <TableCell>
                            {" "}
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.availableDatesAndTimes
                              ? itineraryBooking.itinerary.availableDatesAndTimes
                                .map((date) =>
                                  new Date(date).toLocaleDateString()
                                )
                                .join(", ")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.chosenDate
                              ? new Date(
                                itineraryBooking.itinerary.chosenDate
                              ).toLocaleDateString()
                              : "No date selected"}
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.pickUpLocation
                              ? itineraryBooking.itinerary.pickUpLocation
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {" "}
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.dropOffLocation
                              ? itineraryBooking.itinerary.dropOffLocation
                              : "N/A"}
                          </TableCell>
                          {/* <TableCell>{ itineraryBooking.itinerary && itineraryBooking.itinerary.tourGuideModel?.userName ? itineraryBooking.itinerary.tourGuideModel.userName : "N/A"}</TableCell> */}
                          <TableCell>
                            {tourGuideNames[itineraryBooking._id] || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={itineraryBooking.averageRating}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary &&
                              itineraryBooking.itinerary.tags?.length
                              ? itineraryBooking.itinerary.tags.join(", ")
                              : "No tags available"}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Cancel Booking">
                              <IconButton
                                color="error"
                                aria-label="delete category"
                                onClick={() =>
                                  handleDeleteBooking(
                                    "itinerary",
                                    itineraryBooking.itinerary._id,
                                    itineraryBooking.itinerary.price
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>{" "}
              </div>
            )}
          {/* Flights Table */}
          {(selectedCategory === "Flights" || selectedCategory === "All") && (
            <div>
              {" "}
              <Typography
                variant="h5"
                sx={{ marginTop: "40px", fontWeight: "bold" }}
                gutterBottom
              >
                Flights
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  marginBottom: 4,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  borderRadius: "1.5cap",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Airline
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Departure Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Arrival Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Price
                        <CurrencyConvertor
                          onCurrencyChange={handleCurrencyChangeft}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Origin
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Destination
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          fontSize: "18px",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flightsBookings.map((flight) => (
                      <TableRow key={flight.id}>
                        <TableCell>{flight.flights.companyName}</TableCell>
                        <TableCell>
                          {new Date(
                            flight.flights.departureDate
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            flight.flights.arrivalDate
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {(
                            flight.flights.price *
                            (exchangeRatesft[currencyft] || 1)
                          ).toFixed(2)}{" "}
                          {currencyft}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {flight.flights.departureCity}
                          {" , "}
                          {flight.flights.departureCountry}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {flight.flights.arrivalCity}
                          {" , "}
                          {flight.flights.arrivalCountry}
                        </TableCell>

                        <TableCell>
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              color="error"
                              aria-label="delete category"
                              onClick={() =>
                                handleDeleteThirdPartyBooking(
                                  "flight",
                                  flight.flights.price,
                                  flight.id
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>{" "}
            </div>
          )}
          {/* Hotels Table */}
          {(selectedCategory === "Hotels" || selectedCategory === "All") && (
            <div>
              <Typography
                variant="h5"
                sx={{ marginTop: "40px", fontWeight: "bold" }}
                gutterBottom
              >
                Hotels
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  marginBottom: 4,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  borderRadius: "1.5cap",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Hotel Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Location
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Price
                        <CurrencyConvertor
                          onCurrencyChange={handleCurrencyChangeht}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Check In Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Check Out Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hotelsBookings.map((hotel) => (
                      <TableRow key={hotel._id}>
                        <TableCell>{hotel.hotels.hotelName}</TableCell>
                        <TableCell>
                          {hotel.hotels.city}
                          {"  ,"}
                          {hotel.hotels.country}
                        </TableCell>
                        <TableCell>
                          {(
                            hotel.hotels.price *
                            (exchangeRatesht[currencyht] || 1)
                          ).toFixed(2)}{" "}
                          {currencyht}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            hotel.hotels.checkInDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            hotel.hotels.checkOutDate
                          ).toLocaleDateString()}
                        </TableCell>
                        {/* <TableCell><Rating value={hotel.rating} precision={0.1} readOnly /></TableCell> */}
                        <TableCell>
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              color="error"
                              aria-label="delete category"
                              onClick={() =>
                                handleDeleteThirdPartyBooking(
                                  "hotel",
                                  hotel.hotels.price,
                                  hotel.id
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>{" "}
            </div>
          )}
          {/* Transportation Table */}
          {(selectedCategory === "Transportation" ||
            selectedCategory === "All") && (
              <div>
                {" "}
                <Typography
                  variant="h5"
                  sx={{ marginTop: "40px", fontWeight: "bold" }}
                  gutterBottom
                >
                  Transportation
                </Typography>
                <div
                  style={{
                    paddingBottom: "40px",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    sx={{
                      marginBottom: "40pxkp",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                      borderRadius: "1.5cap",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            Transportation Company
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            Departure Date
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            Arrival Date
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            Price
                            <CurrencyConvertor
                              onCurrencyChange={handleCurrencyChangett}
                            />
                          </TableCell>
                          {/* <TableCell>Origin</TableCell> */}
                          {/* <TableCell>Destination</TableCell> */}
                          <TableCell
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            Transfer Type
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transportationBookings.map((transportation) => (
                          <TableRow key={transportation._id}>
                            <TableCell>
                              {transportation.transportations.companyName}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                transportation.transportations.departureDate
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                transportation.transportations.arrivalDate
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {(
                                transportation.transportations.price *
                                (exchangeRatestt[currencytt] || 1)
                              ).toFixed(2)}{" "}
                              {currencytt}
                            </TableCell>
                            {/* <TableCell> {transportation.City}{" , "}{transportation.Country}</TableCell> */}
                            {/* <TableCell> {transportation.arrivalCity}{" , "}{transportation.arrivalCountry}</TableCell> */}
                            <TableCell>
                              {" "}
                              {transportation.transportations.transferType}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Cancel Booking">
                                <IconButton
                                  color="error"
                                  aria-label="delete Transportation"
                                  onClick={() =>
                                    handleDeleteThirdPartyBooking(
                                      "transportation",
                                      transportation.transportations.price,
                                      transportation.id
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            )}
        </div>
        <Help />
      </div>
    </Box>
  );
};

export default BookingDetails;
