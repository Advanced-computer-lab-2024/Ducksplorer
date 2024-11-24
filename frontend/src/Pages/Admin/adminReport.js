import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calculateProductRating } from "../../Utilities/averageRating";

import {
  Box,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Rating,
} from "@mui/material";

const AdminReport = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [products, setProducts] = useState([]);

  const [priceExchangeRates, setPriceExchangeRates] = useState({});
  const [priceCurrency, setPriceCurrency] = useState("EGP");

  const [earningsExchangeRates, setEarningsExchangeRates] = useState({});
  const [earningsCurrency, setEarningsCurrency] = useState("EGP");

  const [activityExchangeRates, setActivityExchangeRates] = useState({});
  const [activityCurrency, setActivityCurrency] = useState("EGP");

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/reportActivities")
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/reportItineraries")
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the itineraries!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/reportProducts")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handlePriceCurrencyChange = (rates, selectedCurrency) => {
    setPriceExchangeRates(rates);
    setPriceCurrency(selectedCurrency);
  };

  const handleEarningsCurrencyChange = (rates, selectedCurrency) => {
    setEarningsExchangeRates(rates);
    setEarningsCurrency(selectedCurrency);
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "visible",
        height: "100vh",
      }}
    >
      <Link to="/AdminDashboard">Back</Link>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Typography variant="h4">Available activities</Typography>
      </Box>

      {/* Activities Section */}
      <div style={{ flex: 1 }}>
        {activities.length > 0 ? (
          <Box>
            <TableContainer component={Paper} style={{ borderRadius: 20 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* Add table headers */}
                    <TableCell>Name</TableCell>
                    <TableCell>
                      Price
                      <CurrencyConvertor
                        onCurrencyChange={handlePriceCurrencyChange}
                      />
                    </TableCell>
                    <TableCell>Is Open</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Flag</TableCell>
                    <TableCell>Number of Bookings</TableCell>
                    <TableCell>
                      Earnings
                      <CurrencyConvertor
                        onCurrencyChange={handleEarningsCurrencyChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {activities.map((activity) =>
                    activity.deletedActivity === false ? (
                      <TableRow
                        key={activity._id}
                        style={{
                          backgroundColor: activity.flag
                            ? "#ffdddd"
                            : "transparent",
                        }}
                      >
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>{activity.price}</TableCell>
                        <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                        <TableCell>{activity.category}</TableCell>
                        <TableCell>{activity.tags.join(", ")}</TableCell>
                        <TableCell>{activity.specialDiscount}</TableCell>
                        <TableCell>
                          {new Date(activity.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{activity.duration}</TableCell>
                        <TableCell>{activity.location}</TableCell>
                        <TableCell>
                          <Rating
                            value={activity.averageRating}
                            precision={0.1}
                            readOnly
                          />
                        </TableCell>
                        <TableCell>
                          {activity.flag ? (
                            <span
                              style={{
                                color: "red",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <WarningIcon style={{ marginRight: "4px" }} />
                              Inappropriate
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "green",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <CheckCircleIcon style={{ marginRight: "4px" }} />
                              Appropriate
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{activity.bookedCount}</TableCell>
                        <TableCell>
                          {(
                            activity.bookedCount *
                            activity.price *
                            0.1 *
                            (earningsExchangeRates[earningsCurrency] || 1)
                          ).toFixed(2)}{" "}
                          {earningsCurrency}
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No Activities found.
          </Typography>
        )}
      </div>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Typography variant="h4">Available itineraries</Typography>
      </Box>

      <div style={{ flex: 1 }}>
        {itineraries.length > 0 ? (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Activities
                      <CurrencyConvertor
                        onCurrencyChange={handleActivityCurrencyChange}
                      />
                    </TableCell>
                    <TableCell>Locations</TableCell>
                    <TableCell>Timeline</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>
                      Price
                      <CurrencyConvertor
                        onCurrencyChange={handlePriceCurrencyChange}
                      />
                    </TableCell>
                    <TableCell>Available Dates And Times</TableCell>
                    <TableCell>Accessibility</TableCell>
                    <TableCell>Pick Up Location</TableCell>
                    <TableCell>Drop Off Location</TableCell>
                    <TableCell>Ratings</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Flag</TableCell>
                    <TableCell>Active Status</TableCell>
                    <TableCell>Number of Bookings</TableCell>
                    <TableCell>
                      Earnings
                      <CurrencyConvertor
                        onCurrencyChange={handleEarningsCurrencyChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    itineraries.map((itinerary) =>
                      itinerary.deletedItinerary === false ? (
                        <TableRow key={itinerary._id}>
                          <TableCell>
                            {itinerary.activity && itinerary.activity.length > 0
                              ? itinerary.activity.map((activity, index) => (
                                  <div key={index}>
                                    {activity.name || "N/A"} - Price:{" "}
                                    {(
                                      activity.price *
                                      (activityExchangeRates[
                                        activityCurrency
                                      ] || 1)
                                    ).toFixed(2)}{" "}
                                    {activityCurrency},<br />
                                    Location: {activity.location || "N/A"},
                                    <br />
                                    Category: {activity.category || "N/A"}
                                    <br />
                                    <br />{" "}
                                    {/* Adds an extra line break between activities */}
                                  </div>
                                ))
                              : "No activities available"}
                          </TableCell>

                          <TableCell>
                            {itinerary.locations &&
                            itinerary.locations.length > 0
                              ? itinerary.locations.map((location, index) => (
                                  <div key={index}>
                                    <Typography variant="body1">
                                      {index + 1}: {location.trim()}
                                    </Typography>
                                    <br />
                                  </div>
                                ))
                              : "No locations available"}
                          </TableCell>

                          <TableCell>{itinerary.timeline}</TableCell>
                          <TableCell>{itinerary.language}</TableCell>
                          <TableCell>
                            {(
                              itinerary.price *
                              (priceExchangeRates[priceCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {priceCurrency}
                          </TableCell>
                          <TableCell>
                            {itinerary.availableDatesAndTimes.length > 0
                              ? itinerary.availableDatesAndTimes.map(
                                  (dateTime, index) => {
                                    const dateObj = new Date(dateTime);
                                    const date = dateObj
                                      .toISOString()
                                      .split("T")[0]; // YYYY-MM-DD format
                                    const time = dateObj
                                      .toTimeString()
                                      .split(" ")[0]; // HH:MM:SS format
                                    return (
                                      <div key={index}>
                                        Date {index + 1}: {date}
                                        <br />
                                        Time {index + 1}: {time}
                                      </div>
                                    );
                                  }
                                )
                              : "No available dates and times"}
                          </TableCell>

                          <TableCell>{itinerary.accessibility}</TableCell>
                          <TableCell>{itinerary.pickUpLocation}</TableCell>
                          <TableCell>{itinerary.dropOffLocation}</TableCell>
                          <TableCell>
                            <Rating
                              value={itinerary.averageRating}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>

                          <TableCell>
                            {itinerary.tags && itinerary.tags.length > 0
                              ? itinerary.tags.map((tag, index) => (
                                  <div key={index}>
                                    {tag || "N/A"}
                                    <br />
                                    <br />
                                  </div>
                                ))
                              : "No tags available"}
                          </TableCell>

                          <TableCell>
                            {itinerary.flag ? (
                              <span
                                style={{
                                  color: "red",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <WarningIcon style={{ marginRight: "4px" }} />
                                Inappropriate
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "green",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <CheckCircleIcon
                                  style={{ marginRight: "4px" }}
                                />
                                Appropriate
                              </span>
                            )}
                          </TableCell>

                          <TableCell>
                            {itinerary.isDeactivated
                              ? "Activated"
                              : "Deactivated"}
                          </TableCell>
                          <TableCell>{itinerary.bookedCount}</TableCell>
                          <TableCell>
                            {(
                              itinerary.bookedCount *
                              itinerary.price *
                              0.1 *
                              (earningsExchangeRates[earningsCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {earningsCurrency}
                          </TableCell>
                        </TableRow>
                      ) : null
                    ) //We don't output a row when the itinerary has been deleted but cannot be removed from the database since it is booked by previous tourists
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No Itineraries found.
          </Typography>
        )}
      </div>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Typography variant="h4">Available products</Typography>
      </Box>

      <div style={{ flex: 1 }}>
        {products.length > 0 ? (
          <Box>
            <TableContainer component={Paper} style={{ borderRadius: 20 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>
                      Price
                      <CurrencyConvertor
                        onCurrencyChange={handlePriceCurrencyChange}
                      />
                    </TableCell>
                    <TableCell>Average Rating</TableCell>
                    <TableCell>Available Quantity</TableCell>
                    <TableCell>Picture</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>Is Archived</TableCell>
                    <TableCell>Reviews</TableCell>
                    <TableCell>
                      Earnings
                      <CurrencyConvertor
                        onCurrencyChange={handleEarningsCurrencyChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((product) =>
                    !product.isArchived ? (
                      <TableRow key={product._id}>
                        <TableCell>{product.name || "N/A"}</TableCell>
                        <TableCell>
                          {(
                            (product.price || 0) *
                            (priceExchangeRates[priceCurrency] || 1)
                          ).toFixed(2)}{" "}
                          {priceCurrency}
                        </TableCell>
                        <TableCell>
                          <Rating
                            value={calculateProductRating(product.ratings)}
                            precision={0.1}
                            readOnly
                          />
                        </TableCell>
                        <TableCell>
                          {product.availableQuantity || "N/A"}
                        </TableCell>
                        <TableCell>
                          {product.picture ? (
                            <img
                              src={product.picture}
                              alt={product.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            "No image available"
                          )}
                        </TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.sales || 0}</TableCell>
                        <TableCell>
                          {product.isArchived ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {product.reviews.length > 0
                            ? product.reviews.map((review, index) => (
                                <div key={index}>
                                  {review.buyer}: {review.review}
                                </div>
                              ))
                            : "No reviews"}
                        </TableCell>
                        <TableCell>
                          {(
                            (product.price || 0) *
                            0.1 *
                            (product.sales || 0) *
                            (earningsExchangeRates[earningsCurrency] || 1)
                          ).toFixed(2)}{" "}
                          {earningsCurrency}
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No Products found.
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default AdminReport;
