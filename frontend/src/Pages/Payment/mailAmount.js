import AddressDropdown from "../../Components/AddressDropdown.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { Card, Typography, Space, message, Select, Form, Button } from "antd";
import Help from "../../Components/HelpIcon.js";
import ItineraryCardDetailed from "../../Components/itineraryCardDetailed.js";
import ActivityCardDetailed from "../../Components/activityCardDetailed.js";
import FlightCardDetailed from "../../Components/flightCardDetailed.js";
import HotelCardDetailed from "../../Components/hotelCardDetailed.js";
import CartCardDetailed from "../../Components/cartCardDetailed.js";
import TransportationCardDetailed from "../../Components/transportationCardDetailed.js";
import TouristNavBar from "../../Components/TouristNavBar.js";
import { Paper } from "@mui/material";

const { Title } = Typography;
const { Option } = Select;

function PaymentPage() {
  const flight = localStorage.getItem("flight");
  const hotel = localStorage.getItem("hotel");
  const transportation = localStorage.getItem("transportation");
  const [itineraryData, setItineraryData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [price, setPrice] = useState("");
  const [type, setType] = useState(null);
  const [email, setEmail] = useState(
    JSON.parse(localStorage.getItem("user")).email
  );
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const [chosenDate, setChosenDate] = useState(null);
  const [flightsData, setFlight] = useState(
    JSON.parse(localStorage.getItem("flight"))
  );
  const [hotelsData, setHotel] = useState(
    JSON.parse(localStorage.getItem("hotel"))
  );
  const [transportationsData, setTransportation] = useState(
    JSON.parse(localStorage.getItem("transportation"))
  );
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(price);

  const [cartData, setCartData] = useState(null);
  const userJson = localStorage.getItem("user"); // Get the logged-in user's details
  const user = JSON.parse(userJson);
  const userName = user.username;

  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState([]);

  const handleAddressSelect = (addressIndex) => {
    setSelectedAddress(addressIndex); // Update the selected address index
  };

  const addNewAddress = async (address) => {
    try {
      setAddresses((prev) => [...prev, address]); // Update the address list
      message.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const sendConfirmationEmail = async () => {
    try {
      // Retrieve necessary data from localStorage
      const email = localStorage.getItem("paymentEmail");
      const itemId =
        localStorage.getItem("activityId") ||
        localStorage.getItem("itineraryId");
      const type = localStorage.getItem("type");
      // const hotel = localStorage.getItem("hotelBooking"); // Example: add this if relevant
      // const flight = localStorage.getItem("flightBooking"); // Example: add this if relevant
      // const transportation = localStorage.getItem("transportationBooking"); // Example: add this if relevant
      console.log("email,item,type:", email, itemId, type);
      // Make a POST request to the backend
      const response = await fetch(
        "http://localhost:8000/payment/send-confirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            itemId,
            type,
            // hotel,
            // flight,
            // transportation,
          }),
        }
      );
      console.log(response);

      const result = await response.json();
      if (response.ok) {
        message.success("Confirmation email sent successfully!");
        console.log("Email Response:", result);
      } else {
        message.error("Failed to send confirmation email.");
        console.error("Error sending email:", result);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while sending the email.");
    }
  };

  const handleVisaSubmit = async (e) => {
    if (cartData && !selectedAddress) {
      message.error("Please choose a delivery address first.");
      return;
    }
    if (itineraryData && !chosenDate) {
      message.error("Please select a date and time before proceeding.");
      return; // Prevent form submission if no date is selected
    }
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      message.error("User is not logged in.");
      return null;
    }
    const user = JSON.parse(userJson);
    if (!user || !user.username) {
      message.error("User information is missing.");
      return null;
    }
    e.preventDefault();
    const amountInCents = Math.round(finalPrice);
    const email = user.email;
    localStorage.setItem("price", finalPrice);

    try {
      const response = await fetch("http://localhost:8000/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInCents,
          currency: "usd",
          email: email,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.clientSecret) {
        // Store email and clientSecret in localStorage
        localStorage.setItem("paymentEmail", email);
        localStorage.setItem("clientSecret", data.clientSecret);
        // Redirect to checkout page
        navigate("/checkout");
      } else {
        message.error("Error creating payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      message.error("Error initiating payment. Please try again.");
    }
  };

  const handleWalletSubmit = async (e) => {
    if (cartData && !selectedAddress) {
      message.error("Please choose a delivery address first.");
      return;
    }
    if (itineraryData && !chosenDate) {
      message.error("Please select a date and time before proceeding.");
      return; // Prevent form submission if no date is selected
    }
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      message.error("User is not logged in.");
      return null;
    }
    const user = JSON.parse(userJson);
    if (!user || !user.username) {
      message.error("User information is missing.");
      return null;
    }

    const userName = user.username;
    const activityId = localStorage.getItem("activityId");
    const itineraryId = localStorage.getItem("itineraryId");
    const itineraryOrActivity = localStorage.getItem("type");
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/touristRoutes/payWallet/${userName}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finalPrice }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        message.success("Payment successfully completed!");
        if (itineraryOrActivity === "product") {
          await axios.delete(
            "http://localhost:8000/touristRoutes/emptyCart",
            userName
          );
          navigate("/orders");
        }
        // Payment succeeded; now create the booking in the backend
        const bookingResponse = await fetch(
          `http://localhost:8000/touristRoutes/booking/${userName}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              activityId: activityId,
              itineraryId: itineraryId,
              type: itineraryOrActivity,
              flight: flightsData,
              hotel: hotelsData,
              transportation: transportationsData,
              date: chosenDate,
              price: finalPrice,
            }),
          }
        );
        const bookingResult = await bookingResponse.json();
        console.log("Booking Result", bookingResult);

        if (bookingResult.status === 200) {
          console.log("Booking successfully created:", bookingResult);
          navigate("/myBookings");
          sendConfirmationEmail();
        } else {
          console.error("Booking creation failed:", bookingResult.message);
        }
      } else {
        message.error(
          "Error creating payment. Not enough money in the wallet."
        );
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      message.error("Error creating payment. Not enough money in the wallet.");
    }
  };

  const handleDisplayBooked = async () => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }

      const itineraryOrActivity = localStorage.getItem("type");
      const activityId = localStorage.getItem("activityId");
      const itineraryId = localStorage.getItem("itineraryId");
      const cartId = localStorage.getItem("cartId");

      if (!itineraryOrActivity) {
        message.error("Type information is missing.");
        return null;
      }

      //setEmail(email);
      setType(itineraryOrActivity);

      let response;

      if (itineraryOrActivity === "itinerary" && itineraryId) {
        response = await axios.get(
          `http://localhost:8000/touristRoutes/viewDesiredItinerary/${itineraryId}`
        );
        if (response.status === 200) {
          setItineraryData(response.data);
          setPrice(response.data.price);
          setFinalPrice(response.data.price);
          localStorage.setItem("price", finalPrice);
        } else {
          message.error("Failed to retrieve itinerary details.");
        }
      } else if (itineraryOrActivity === "activity" && activityId) {
        console.log("Fetching activity data for ID:", activityId); // Debugging
        response = await axios.get(
          `http://localhost:8000/touristRoutes/viewDesiredActivity/${activityId}`
        );
        if (response.status === 200) {
          console.log("Activity data fetched:", response.data); // Debugging
          setActivityData(response.data);
          setPrice(response.data.price);
          setFinalPrice(response.data.price);
          localStorage.setItem("price", finalPrice);
        } else {
          message.error("Failed to retrieve activity details.");
        }
      } else if (itineraryOrActivity === "flight") {
        //setFlight(flight);
        setPrice(flightsData.price);
        setFinalPrice(flightsData.price);
        console.log("Flight sada data fetched:", flight); // Debugging
        console.log("FlightData fetched:", flightsData); // Debugging
        console.log("flight price", flightsData.price);
      } else if (itineraryOrActivity === "hotel" && hotel) {
        //setHotel(hotel);
        setPrice(hotelsData.price);
        setFinalPrice(hotelsData.price);
      } else if (itineraryOrActivity === "transportation" && transportation) {
        // setTransportation(transportation);
        setPrice(transportationsData.price);
        setFinalPrice(transportationsData.price);
      } else if (itineraryOrActivity === "product" && cartId) {
        console.log("Fetching activity data for ID:", cartId); // Debugging
        const response = await axios.get(
          `http://localhost:8000/touristRoutes/myCart/${userName}`
        );
        if (response.status === 200) {
          console.log("Cart data fetched:", response.data); // Debugging
          setCartData(response.data.cart);
          const totalPrice = localStorage.getItem("totalPrice");
          setPrice(totalPrice);
          setFinalPrice(totalPrice);
          localStorage.setItem("price", finalPrice);
        } else {
          message.error("Failed to retrieve activity details.");
        }
      } else {
        message.error("Failed to retrieve details");
      }
      //console.log(response);
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while retrieving the booking.");
    }
  };

  const [form] = Form.useForm();

  const handleDateChange = async (value) => {
    console.log("date", value);
    setChosenDate(value);
    form.setFieldsValue({ dateTime: value });
    localStorage.setItem("date", value);
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Perform the next action here, such as navigating to another page
  };

  useEffect(() => {
    handleDisplayBooked();
  }, [type]);

  const applyPromoCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/touristRoutes/validCode",
        { code: promoCode }
      );
      const discountPercentage = response.data.discount;

      // Calculate the discounted price
      const discountedPrice = price - (price * discountPercentage) / 100;
      setDiscount(discountPercentage);
      setFinalPrice(discountedPrice);
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to apply promo code");
    }
  };

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    if (cartData && !selectedAddress) {
      message.error("Please choose a delivery address first.");
      return;
    }
    try {
      // Call the empty cart API
      const response = await axios.delete(
        "http://localhost:8000/touristRoutes/emptyCart",
        {
          data: { userName },
        }
      );
      console.log(response.data.message); // Log success message
      // Navigate to "My Purchases" on success
      navigate("/orders");
    } catch (error) {
      console.error(
        "Error emptying cart:",
        error.response?.data || error.message
      );
      message.error("Failed to empty the cart. Please try again.");
    }
  };

  return (
    <div
      style={{
        overflowY: "visible",
        height: "100vh",
      }}
    >
      <TouristNavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1500px",
          margin: "auto",
          gap: "1rem",
          overflowY: "visible",
          height: "120vh",
        }}
      >
        <div>
          {itineraryData ||
          activityData ||
          (flightsData && type === "flight") ||
          (hotelsData && type === "hotel") ||
          (transportationsData && type === "transportation") ||
          (cartData && type === "product") ? (
            type === "itinerary" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "50vw",
                      margin: "20px auto",
                      borderRadius: "8px",
                      variant: "middle",
                      jsyt: "center",
                    }}
                  >
                    <ItineraryCardDetailed itinerary={itineraryData} />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    minHeight: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "108.5vh",
                  }}
                >
                  <Form style={{ width: "100%", height: "90%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <Form.Item
                      name="dateTime"
                      label={
                        <span style={{ fontWeight: "bold", fontSize: 20 }}>
                          Date and Time
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please select a date and time!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select a Date and Time"
                        onChange={handleDateChange}
                        style={{ width: "100%", fontSize: 20 }}
                      >
                        {itineraryData?.availableDatesAndTimes
                          .filter((dateTime) => {
                            const currentDate = new Date(); // Get the current date and time
                            const dateObj = new Date(dateTime); // Convert available date to Date object
                            return dateObj >= currentDate; // Only keep dates in the future or equal to now
                          })
                          .map((dateTime, index) => {
                            const dateObj = new Date(dateTime);
                            const date = dateObj.toISOString().split("T")[0];
                            const time = dateObj.toTimeString().split(" ")[0];
                            const displayText = `${date} at ${time}`;

                            return (
                              <Option key={index} value={dateTime} required>
                                {displayText}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                    <p style={{ fontSize: 15 }}>
                      <strong>Selected Date and Time:</strong>{" "}
                      {chosenDate
                        ? new Date(chosenDate).toLocaleString()
                        : "None selected"}
                    </p>

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "5%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "10%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : type === "activity" && activityData ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "800px",
                      margin: "20px auto",
                      borderRadius: "8px",
                    }}
                  >
                    <ActivityCardDetailed activity={activityData} />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    minHeight: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "89.5vh",
                  }}
                >
                  <Form style={{ width: "100%", height: "90%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "3%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "3%" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "3%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : type === "flight" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "800px",
                      margin: "20px auto",
                      borderRadius: "8px",
                    }}
                  >
                    <FlightCardDetailed flightsData={flightsData} />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    minHeight: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "89.5vh",
                  }}
                >
                  <Form style={{ width: "100%", height: "90%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "3%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "3%" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "3%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : type === "product" && cartData ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "800px",
                      margin: "20px auto",
                      borderRadius: "8px",
                    }}
                  >
                    <CartCardDetailed cartData={cartData} />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    //when pressing on add address 1450px and when not 950 x when
                    height: "auto",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Form style={{ width: "100%", height: "100%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <AddressDropdown
                      onAddressSelect={handleAddressSelect}
                      onAddAddress={addNewAddress}
                    />

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "3%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "3%" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "3%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : type === "hotel" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "800px",
                      margin: "20px auto",
                      borderRadius: "8px",
                    }}
                  >
                    <HotelCardDetailed hotelsData={hotelsData} />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    minHeight: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "89.5vh",
                  }}
                >
                  <Form style={{ width: "100%", height: "90%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "3%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "3%" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "3%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : type === "transportation" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "800px",
                      margin: "20px auto",
                      borderRadius: "8px",
                    }}
                  >
                    <TransportationCardDetailed
                      transportation={transportationsData}
                    />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    minHeight: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "89.5vh",
                  }}
                >
                  <Form style={{ width: "100%", height: "90%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "3%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "3%" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "3%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : type === "flight" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* Left Section */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      width: "800px",
                      margin: "20px auto",
                      borderRadius: "8px",
                    }}
                  >
                    <FlightCardDetailed flightsData={flightsData} />
                  </Card>
                </div>
                <Paper
                  elevation={3}
                  style={{
                    width: "800px",
                    minHeight: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "89.5vh",
                  }}
                >
                  <Form style={{ width: "100%", height: "90%" }}>
                    <h1
                      style={{
                        fontWeight: "bold",
                        paddingBottom: "5%",
                        fontSize: 50,
                      }}
                    >
                      {" "}
                      Payment Details
                    </h1>

                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "3%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Email
                      </p>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "1%",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Amount
                      </p>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setAmount(e.target.value * 100)}
                        required
                        readOnly
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "3%" }}>
                      <p
                        style={{
                          textAlign: "left",
                          marginTop: "4%",
                          marginBottom: "2px",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Promo Code
                      </p>
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                        style={{
                          padding: "1%",
                          width: "100%",
                          borderRadius: "1%",
                          border: "0.5% solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      size="md"
                      variant="solid"
                      className="blackhover"
                      zIndex={2}
                      type="submit"
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        flex: 1,
                        marginRight: "12px",
                        marginBottom: "5%",
                        backgroundColor: "#ff9933",
                      }}
                      onClick={applyPromoCode}
                    >
                      Apply Promo Code
                    </button>
                    {discount > 0 && (
                      <p style={{ textAlign: "left" }}>
                        Discount Applied: {discount}%
                      </p>
                    )}
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Taxes: 10%
                    </h3>
                    <h3
                      style={{ textAlign: "left", fontSize: 15, color: "grey" }}
                    >
                      Subtotal: {price * 0.9}
                    </h3>
                    <h3
                      style={{
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: "bold",
                        marginBottom: "5%",
                      }}
                    >
                      Taxes and shipping calculated at checkout
                    </h3>
                    <h2
                      style={{
                        textAlign: "left",
                        marginBottom: "3%",
                        fontWeight: "bold",
                      }}
                    >
                      Final Price: {finalPrice}EGP
                    </h2>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleVisaSubmit}
                      >
                        Visa
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleWalletSubmit}
                      >
                        Wallet
                      </button>
                      <button
                        size="md"
                        variant="solid"
                        className="blackhover"
                        zIndex={2}
                        type="submit"
                        style={{
                          padding: "10px",
                          fontSize: "1rem",
                          flex: 1,
                          marginRight: "12px",
                          backgroundColor: "#ff9933",
                        }}
                        onClick={handleCashOnDelivery}
                      >
                        Cash on Delivery
                      </button>
                    </form>
                  </Form>
                </Paper>
              </div>
            ) : null
          ) : (
            <p>Loading booking details...</p>
          )}
        </div>

        <Help />
      </div>
    </div>
  );
}

export default PaymentPage;
