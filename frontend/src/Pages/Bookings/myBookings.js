import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { message } from "antd";
import TouristNavBar from "../../Components/TouristNavBar";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import Help from "../../Components/HelpIcon";
import {Link} from "react-router-dom";

const BookingDetails = () => {
  const userName = JSON.parse(localStorage.getItem("user")).username;
  const [booking, setBooking] = useState(null);
  const [exchangeRatesAc, setExchangeRatesAc] = useState({});
  const [currencyAc, setCurrencyAc] = useState("EGP");
  const [exchangeRatesIt, setExchangeRatesIt] = useState({});
  const [currencyIt, setCurrencyIt] = useState("EGP");
  const [exchangeRatesft, setExchangeRatesft] = useState({});
  const [currencyft, setCurrencyft] = useState('EGP');
  const [exchangeRatesht, setExchangeRatesht] = useState({});
  const [currencyht, setCurrencyht] = useState('EGP');
  const [exchangeRatestt, setExchangeRatestt] = useState({});
  const [currencytt, setCurrencytt] = useState('EGP');
  const [activityBookings, setActivityBookings] = useState([]);
  const [itineraryBookings, setItineraryBookings] = useState([]);
  const [flightsBookings, setFlightsBookings] = useState([]);
  const [hotelsBookings, setHotelsBookings] = useState([]);
  const [transportationBookings, setTransportationBookings] = useState([]);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = localStorage.getItem("guest") === "true";

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
      console.log(response.data)
      setFlightsBookings(response.data.flights || []);
      setHotelsBookings(response.data.hotels || []);
      console.log("HotelsData",response.data.hotels);
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
  if (loading) return <p>Loading...</p>;

  const handleDeleteBooking = async (type, itemId, price) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/touristRoutes/booking/${userName}`,
        {
          type,
          itemId,
          price,
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
        setFlightsBookings((prev) =>
          prev.filter((flight) => flight._id !== booking._id)
        );
        setHotelsBookings((prev) =>
          prev.filter((hotel) => hotel._id !== booking._id)
        );
        setTransportationBookings((prev) =>
          prev.filter((transportation) => transportation._id !== booking._id)
        );

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

  const fetchTourGuideName = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:8000/tourGuideRate/getUserNameById/${bookingId}`);
      console.log("Tour Guide Name Response:", response.data);
      return response.data.userName;
    } catch (error) {
      console.error("Error fetching tour guide name:", error.message);
      return "N/A";
    }
  };

  if (
    !activityBookings.length &&
    !itineraryBookings.length &&
    !flightsBookings.length &&
    !hotelsBookings.length &&
    !transportationBookings.length
  )
    return <p>You have no bookings.</p>;

  if (!Array.isArray(activityBookings) || !Array.isArray(itineraryBookings)) {
    return <p>No booking details available.</p>;
  }

  return (
    <>
      <TouristNavBar />
      <Button
        component={Link}
        to={isGuest ? "/guestDashboard" : "/touristDashboard"}
        variant="contained"
        color="primary"
        style={{ marginBottom: "20px" }}
      >
        Back to Dashboard
      </Button>
      <div style={{ overflowY: "visible", height: "90vh" }}>
        <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>

        {/* Activities Table */}
        <Typography variant="h5" gutterBottom>
          Activities
        </Typography>
        <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Is Open</TableCell>
                <TableCell>Advertiser</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>
                  Price
                  <CurrencyConvertor
                    onCurrencyChange={handleCurrencyChangeAc}
                  />
                </TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Special Discount</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityBookings.map((activityBooking) => (
                <TableRow key={activityBooking._id}>
                  <TableCell>{activityBooking.activity?.name || "No Name"}</TableCell>
                  <TableCell>{activityBooking.activity?.isOpen ? "Yes" : "No"}</TableCell>
                  <TableCell>{activityBooking.activity?.advertiser || "N/A"}</TableCell>
                  <TableCell>{activityBooking.activity?.date ? new Date(activityBooking.activity.date).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{activityBooking.activity?.location || "N/A"}</TableCell>
                  <TableCell>
                    {(activityBooking.activity?.price * (exchangeRatesAc[currencyAc] || 1)).toFixed(2)} {" "}{currencyAc}
                  </TableCell>
                  <TableCell>{activityBooking.activity?.category || "N/A"}</TableCell>
                  <TableCell>{activityBooking.activity?.tags?.join(", ") || "N/A"}</TableCell>
                  <TableCell>{activityBooking.activity?.specialDiscount || 0}%</TableCell>
                  <TableCell>{activityBooking.activity?.duration || "N/A"} mins</TableCell>
                  <TableCell>
                    <Rating
                      value={activityBooking.activity?.averageRating || 0}
                      precision={0.1}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Delete Itinerary">
                      <IconButton color="error" aria-label="delete category" onClick={() => handleDeleteBooking('activity', activityBooking.activity?._id, activityBooking.activity?.price)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>

        {/* Itineraries Table */}
        <Typography variant="h5" gutterBottom>
          Itineraries
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity Names</TableCell>
                <TableCell>Locations</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>
                  Price
                  <CurrencyConvertor
                    onCurrencyChange={handleCurrencyChangeIt}
                  />
                </TableCell>
                <TableCell>Available Dates & Times</TableCell>
                <TableCell>Chosen Date</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell>Pick-Up Location</TableCell>
                <TableCell>Drop-Off Location</TableCell>
                <TableCell>Tour Guide</TableCell>
                <TableCell>Average Rating</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itineraryBookings.map((itineraryBooking) => (
                <TableRow key={itineraryBooking._id}>
                  <TableCell>{itineraryBooking.itinerary && itineraryBooking.itinerary.activity
                            ? itineraryBooking.itinerary.activity.map((act) => act.name).join(", ")
                            : "N/A"}
                  </TableCell>
                  <TableCell>{itineraryBooking.itinerary && itineraryBooking.itinerary.locations
                          ? itineraryBooking.itinerary.locations.join(", ")
                          : "N/A"}
                  </TableCell>
                  <TableCell>{itineraryBooking.itinerary && itineraryBooking.itinerary.timeline
          ? itineraryBooking.itinerary.timeline
          : "N/A"}</TableCell>
                  <TableCell> {itineraryBooking.itinerary && itineraryBooking.itinerary.language
          ? itineraryBooking.itinerary.language
          : "N/A"}</TableCell>
                  <TableCell>
                  {itineraryBooking.itinerary && itineraryBooking.chosenPrice
          ? (itineraryBooking.chosenPrice * (exchangeRatesIt[currencyIt] || 1)).toFixed(2) + ` ${currencyIt}`
          : "N/A"}                  </TableCell>
                  <TableCell> {itineraryBooking.itinerary && itineraryBooking.itinerary.availableDatesAndTimes
          ? itineraryBooking.itinerary.availableDatesAndTimes.map((date) => new Date(date).toLocaleDateString()).join(", ")
          : "N/A"}</TableCell>
                  <TableCell>{itineraryBooking.itinerary && itineraryBooking.itinerary.chosenDate
          ? new Date(itineraryBooking.itinerary.chosenDate).toLocaleDateString()
          : "N/A"}</TableCell>
                  <TableCell>{itineraryBooking.itinerary && itineraryBooking.itinerary.accessibility
          ? itineraryBooking.itinerary.accessibility
          : "N/A"}</TableCell>
                  <TableCell>{itineraryBooking.itinerary && itineraryBooking.itinerary.pickUpLocation
          ? itineraryBooking.itinerary.pickUpLocation
          : "N/A"}</TableCell>
                  <TableCell> {itineraryBooking.itinerary && itineraryBooking.itinerary.dropOffLocation
          ? itineraryBooking.itinerary.dropOffLocation
          : "N/A"}</TableCell>
                  <TableCell>{ itineraryBooking.itinerary && itineraryBooking.itinerary.tourGuideModel?.userName ? itineraryBooking.itinerary.tourGuideModel.userName : "N/A"}</TableCell>
                  <TableCell><Rating
                    value={itineraryBooking.itinerary.averageRating}
                    precision={0.1}
                    readOnly
                  /></TableCell>
                  <TableCell>  {itineraryBooking.itinerary && itineraryBooking.itinerary.tags
          ? itineraryBooking.itinerary.tags.join(", ")
          : "N/A"}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Itinerary">
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
        </TableContainer>

        {/* Flights Table */}
        <Typography variant="h5" sx ={{ marginTop: '40px' }}gutterBottom>Flights</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Airline</TableCell>
                <TableCell>Departure Date</TableCell>
                <TableCell>Arrival Date</TableCell>
                <TableCell>
                  Price
                  <CurrencyConvertor
                    onCurrencyChange={handleCurrencyChangeft}
                  />
                </TableCell>
                <TableCell>Origin</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flightsBookings.map((flight) => (
                <TableRow key={flight._id}>
                  <TableCell>{flight.companyName}</TableCell>
                  <TableCell>
                    {new Date(flight.departureDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(flight.arrivalDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {(
                      flight.price * (exchangeRatesft[currencyft] || 1)
                    ).toFixed(2)}{" "}
                    {currencyft}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {flight.departureCity}
                    {" , "}
                    {flight.departureCountry}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {flight.arrivalCity}
                    {" , "}
                    {flight.arrivalCountry}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Delete Flight">
                    <IconButton
                        color="error"
                        aria-label="delete category"
                        onClick={() =>
                          handleDeleteThirdPartyBooking(
                            "flight",
                            flight.price,
                            flight
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
          
          {/* Hotels Table */}
        <Typography variant="h5" sx={{ marginTop: '40px' }}gutterBottom>Hotels</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price<CurrencyConvertor onCurrencyChange={handleCurrencyChangeht} /></TableCell>
                <TableCell>Check In Date</TableCell>
                <TableCell>Check Out Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hotelsBookings.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell>{hotel.hotelName}</TableCell>
                  <TableCell>{hotel.city}{"  ,"}{hotel.country}</TableCell>
                  <TableCell>
                    {(hotel.price * (exchangeRatesht[currencyht] || 1)).toFixed(2)} {currencyht}
                  </TableCell>
                  <TableCell>{new Date(hotel.checkInDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(hotel.checkOutDate).toLocaleDateString()}</TableCell>
                  {/* <TableCell><Rating value={hotel.rating} precision={0.1} readOnly /></TableCell> */}
                  <TableCell>
                    <Tooltip title="Delete Hotel">
                      <IconButton color="error" aria-label="delete category" onClick={() => handleDeleteThirdPartyBooking('hotel',hotel.price,hotel)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Transportation Table */}
        <Typography variant="h5" sx={{ marginTop: '40px' }}gutterBottom>Transportation</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transportation Company</TableCell>
                <TableCell>Departure Date</TableCell>
                <TableCell>Arrival Date</TableCell>
                <TableCell>Price<CurrencyConvertor onCurrencyChange={handleCurrencyChangett} /></TableCell>
                {/* <TableCell>Origin</TableCell> */}
                {/* <TableCell>Destination</TableCell> */}
                <TableCell>Transfer Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transportationBookings.map((transportation) => (
                <TableRow key={transportation._id}>
                  <TableCell>{transportation.companyName}</TableCell>
                  <TableCell>{new Date(transportation.departureDate).toLocaleString()}</TableCell>
                  <TableCell>{new Date(transportation.arrivalDate).toLocaleString()}</TableCell>
                  <TableCell>
                    {(transportation.price * (exchangeRatestt[currencytt] || 1)).toFixed(2)} {currencytt}
                  </TableCell>
                  {/* <TableCell> {transportation.City}{" , "}{transportation.Country}</TableCell> */}
                  {/* <TableCell> {transportation.arrivalCity}{" , "}{transportation.arrivalCountry}</TableCell> */}
                  <TableCell> {transportation.transferType}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Transportation">
                      <IconButton color="error" aria-label="delete Transportation" onClick={() => handleDeleteThirdPartyBooking('transportation',transportation.price,transportation)}>
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
      <Help />
    </>
  );
};

export default BookingDetails;
