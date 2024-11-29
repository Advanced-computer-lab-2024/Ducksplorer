import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calculateProductRating } from "../../Utilities/averageRating";
import { calculateAverageRating } from "../../Utilities/averageRating";
import MyChips from "../../Components/MyChips";

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
  const chipNames = [
    "Activities Report",
    "Itineraries Report",
    "Products Report",
  ];
  const [selectedCategory, setSelectedCategory] = useState("Activities Report");
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

  const handleChipClick = (chipName) => {
    setSelectedCategory(chipName);
    console.log(selectedCategory);
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
      <MyChips chipNames={chipNames} onChipClick={handleChipClick} />

      <Link to="/AdminDashboard">Back</Link>

      {selectedCategory === "Activities Report" && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Activities Report</Typography>
        </Box>
      )}

      {selectedCategory === "Activities Report" && (
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
                      <TableCell>
                        Earnings
                        <CurrencyConvertor
                          onCurrencyChange={handleEarningsCurrencyChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {activities.length > 0 ? (
                      activities.map(
                        (activityBooking) =>
                          activityBooking.activity ? (
                            <TableRow key={activityBooking.activity._id}>
                              <TableCell>
                                {activityBooking.activity.name}
                              </TableCell>
                              <TableCell>
                                {(
                                  activityBooking.chosenPrice *
                                  (priceExchangeRates[priceCurrency] || 1)
                                ).toFixed(2)}{" "}
                                {priceCurrency}
                              </TableCell>
                              <TableCell>
                                {activityBooking.activity.isOpen ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>
                                {activityBooking.activity.category}
                              </TableCell>
                              <TableCell>
                                {activityBooking.activity.tags.join(", ")}
                              </TableCell>
                              <TableCell>
                                {activityBooking.activity.specialDiscount}
                              </TableCell>
                              <TableCell>
                                {activityBooking.chosenDate
                                  ? (() => {
                                      const dateObj = new Date(
                                        activityBooking.chosenDate
                                      );
                                      const date = dateObj
                                        .toISOString()
                                        .split("T")[0];
                                      const time = dateObj
                                        .toTimeString()
                                        .split(" ")[0];
                                      return (
                                        <div>
                                          {date} at {time}
                                        </div>
                                      );
                                    })()
                                  : "No available date"}
                              </TableCell>
                              <TableCell>
                                {activityBooking.activity.duration}
                              </TableCell>
                              <TableCell>
                                {activityBooking.activity.location}
                              </TableCell>
                              <TableCell>
                                <Rating
                                  value={calculateAverageRating(
                                    activityBooking.activity.ratings
                                  )}
                                  precision={0.1}
                                  readOnly
                                />
                              </TableCell>

                              <TableCell>
                                {activityBooking.activity.flag ? (
                                  <span
                                    style={{
                                      color: "red",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <WarningIcon
                                      style={{ marginRight: "4px" }}
                                    />
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
                                {(
                                  activityBooking.chosenPrice *
                                  0.1 *
                                  (earningsExchangeRates[earningsCurrency] || 1)
                                ).toFixed(2)}{" "}
                                {earningsCurrency}
                              </TableCell>
                            </TableRow>
                          ) : null // Don't render the row for deleted activities
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12}>No activities found</TableCell>
                      </TableRow>
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
      )}

      {selectedCategory === "Itineraries Report" && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4"> Itineraries Report</Typography>
        </Box>
      )}

      {selectedCategory === "Itineraries Report" && (
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
                      <TableCell>Date</TableCell>
                      <TableCell>Accessibility</TableCell>
                      <TableCell>Pick Up Location</TableCell>
                      <TableCell>Drop Off Location</TableCell>
                      <TableCell>Ratings</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Flag</TableCell>
                      <TableCell>Active Status</TableCell>
                      <TableCell>
                        Earnings
                        <CurrencyConvertor
                          onCurrencyChange={handleEarningsCurrencyChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itineraries.map((itineraryBooking) =>
                      itineraryBooking.itinerary ? (
                        <TableRow key={itineraryBooking.itinerary._id}>
                          <TableCell>
                            {itineraryBooking.itinerary.activity &&
                            itineraryBooking.itinerary.activity.length > 0
                              ? itineraryBooking.itinerary.activity.map(
                                  (activity, index) => (
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
                                  )
                                )
                              : "No activities available"}
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary.locations &&
                            itineraryBooking.itinerary.locations.length > 0
                              ? itineraryBooking.itinerary.locations.map(
                                  (location, index) => (
                                    <div key={index}>
                                      <Typography variant="body1">
                                        {index + 1}: {location.trim()}
                                      </Typography>
                                      <br />
                                    </div>
                                  )
                                )
                              : "No locations available"}
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary.timeline}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary.language}
                          </TableCell>
                          <TableCell>
                            {(
                              itineraryBooking.chosenPrice *
                              (priceExchangeRates[priceCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {priceCurrency}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.chosenDate
                              ? (() => {
                                  const dateObj = new Date(
                                    itineraryBooking.chosenDate
                                  );
                                  const date = dateObj
                                    .toISOString()
                                    .split("T")[0];
                                  const time = dateObj
                                    .toTimeString()
                                    .split(" ")[0];
                                  return (
                                    <div>
                                      {date} at {time}
                                    </div>
                                  );
                                })()
                              : "No available date"}
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary.accessibility}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary.pickUpLocation}
                          </TableCell>
                          <TableCell>
                            {itineraryBooking.itinerary.dropOffLocation}
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={itineraryBooking.itinerary.averageRating}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary.tags &&
                            itineraryBooking.itinerary.tags.length > 0
                              ? itineraryBooking.itinerary.tags.map(
                                  (tag, index) => (
                                    <div key={index}>
                                      {tag || "N/A"}
                                      <br />
                                      <br />
                                    </div>
                                  )
                                )
                              : "No tags available"}
                          </TableCell>

                          <TableCell>
                            {itineraryBooking.itinerary.flag ? (
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
                            {itineraryBooking.itinerary.isDeactivated
                              ? "Activated"
                              : "Deactivated"}
                          </TableCell>
                          <TableCell>
                            {(
                              itineraryBooking.itinerary.bookedCount *
                              itineraryBooking.chosenPrice *
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
              No Itineraries found.
            </Typography>
          )}
        </div>
      )}

      {selectedCategory === "Products Report" && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4"> Products report</Typography>
        </Box>
      )}

      {selectedCategory === "Products Report" && (
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
                      <TableCell>Quantity</TableCell>
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
                    {products.map((productBooking) =>
                      productBooking.product ? (
                        <TableRow key={productBooking.product._id}>
                          <TableCell>
                            {productBooking.product.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {(
                              (productBooking.chosenPrice || 0) *
                              (priceExchangeRates[priceCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {priceCurrency}
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={calculateProductRating(productBooking.product.ratings)}
                              precision={0.1}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            {productBooking.chosenQuantity || "N/A"}
                          </TableCell>
                          <TableCell>
                            {productBooking.product.picture ? (
                              <img
                                src={productBooking.product.picture}
                                alt={productBooking.product.name}
                                style={{ width: "50px", height: "50px" }}
                              />
                            ) : (
                              "No image available"
                            )}
                          </TableCell>
                          <TableCell>{productBooking.product.description}</TableCell>
                          <TableCell>{productBooking.product.sales || 0}</TableCell>
                          <TableCell>
                            {productBooking.product.isArchived ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {productBooking.product.reviews.length > 0
                              ? productBooking.product.reviews.map((review, index) => (
                                  <div key={index}>
                                    {review.buyer}: {review.review}
                                  </div>
                                ))
                              : "No reviews"}
                          </TableCell>
                          <TableCell>
                            {(
                              (productBooking.chosenPrice || 0) *
                              0.1 *
                              (productBooking.product.sales || 0) *
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
      )}
    </Box>
  );
};

export default AdminReport;
