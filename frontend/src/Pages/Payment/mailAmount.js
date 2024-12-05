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
          await axios.delete("http://localhost:8000/touristRoutes/emptyCart", userName);
          navigate("/myPurchases");
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
        } else {
          console.error("Booking creation failed:", bookingResult.message);
        }
      } else {
        message.error("Error creating payment. Not enough money in the wallet.");
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
      }
      else {
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
      const discountedPrice = price - ((price * discountPercentage) / 100);
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
      const response = await axios.delete("http://localhost:8000/touristRoutes/emptyCart", {
        data: { userName }
      });
      console.log(response.data.message); // Log success message
      // Navigate to "My Purchases" on success
      navigate("/myPurchases");
    } catch (error) {
      console.error("Error emptying cart:", error.response?.data || error.message);
      message.error("Failed to empty the cart. Please try again.");
    }
  };

  return (
    <div
      style={{
        overflowY: "visible",
        height: "120vh",
      }}
    >
      <TouristNavBar />
      <Button
        onClick={() => navigate(-1)}
        style={{ marginLeft: "0%" }} // Add margin to position the button to the left
      >
        Go Back
      </Button>
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
              <div>
                <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                  <ItineraryCardDetailed itinerary={itineraryData} />
                </Card>

                <Form
                // form={form}
                // onFinish={handleVisaSubmit}
                // layout="vertical"
                // initialValues={{ dateTime: null }}
                >
                  <Form.Item
                    name="dateTime"
                    label="Date and Time"
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
                      style={{ width: "100%" }}
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
                  <p>
                    <strong>Selected Date and Time:</strong>{" "}
                    {chosenDate
                      ? new Date(chosenDate).toLocaleString()
                      : "None selected"}
                  </p>

                  <h1> Payment Details</h1>

                  <p>Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={price}
                    onChange={(e) => setAmount(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Promo Code</p>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button onClick={applyPromoCode}>Apply Promo Code</Button>
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}
                  <h2>Final Price: {finalPrice}EGP</h2>
                </Form>
              </div>
            ) : type === "activity" && activityData ? (
              <div>
                <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                  <ActivityCardDetailed activity={activityData} />
                </Card>
                <Form>
                  <h1>Payment Details</h1>

                  <p>Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={price}
                    onChange={(e) => setAmount(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Promo Code</p>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button onClick={applyPromoCode}>Apply Promo Code</Button>
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}
                  <h2>Final Price: {finalPrice}EGP</h2>
                </Form>
              </div>
            ) : type === "flight" ? (
              <div>
                <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                  <FlightCardDetailed flightsData={flightsData} />
                </Card>
                <Form>
                  <h1>Enter Payment Details</h1>

                  <p>Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={flightsData.price}
                    onChange={(e) => setAmount(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <p>Promo Code</p>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button onClick={applyPromoCode}>Apply Promo Code</Button>
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}
                  <h2>Final Price: {finalPrice}EGP</h2>
                </Form>
              </div>
            ) : type === "hotel" ? (
              <div>
                <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                  <HotelCardDetailed hotelsData={hotelsData} />
                </Card>
                <Form>
                  <h1>Enter Payment Details</h1>

                  <p>Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={hotelsData.price}
                    onChange={(e) => setAmount(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Promo Code</p>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button onClick={applyPromoCode}>Apply Promo Code</Button>
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}
                  <h2>Final Price: {finalPrice}EGP</h2>
                </Form>
              </div>
            ) : type === "transportation" ? (
              <div>
                <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                  <TransportationCardDetailed transportation={transportationsData} />
                </Card>
                <Form>
                  <h1>Enter Payment Details</h1>

                  <p>Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transportationsData.price}
                    onChange={(e) => setAmount(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Promo Code</p>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button onClick={applyPromoCode}>Apply Promo Code</Button>
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}
                  <h2>Final Price: {finalPrice}EGP</h2>
                </Form>
              </div>
            ) : type === "product" && cartData ? (
              <div>
                <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                  <CartCardDetailed cartData={cartData} />
                </Card>
                <Form>
                  <h1>Payment Details</h1>

                  <AddressDropdown onAddressSelect={handleAddressSelect} onAddAddress={addNewAddress} />
                  {/* {selectedAddress && <p>Selected Address: 
                    {`${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state || ""}, ${selectedAddress.country} (${selectedAddress.postalCode})`}
                  </p>} */}

                  <p>Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={price}
                    onChange={(e) => setAmount(e.target.value * 100)}
                    required
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />

                  <p>Promo Code</p>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)} //check if it exists and if yes change price
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Button onClick={applyPromoCode}>Apply Promo Code</Button>
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}
                  <h2>Final Price: {finalPrice}EGP</h2>
                </Form>
              </div>
            ) : null
          ) : (
            <p>Loading booking details...</p>
          )}
        </div>
        <form style={{ display: "flex", width: "100%" }}>
          <button
            type="submit"
            onClick={handleVisaSubmit}
            style={{
              padding: "10px",
              fontSize: "1rem",
              flex: 1, // Ensures both buttons take equal space
              marginRight: "12px", // Adds space between the buttons
            }}
          >
            Visa
          </button>
          <button
            type="submit"
            onClick={handleWalletSubmit}
            style={{
              padding: "10px",
              fontSize: "1rem",
              flex: 1, // Makes this button take equal space as the first one
            }}
          >
            Wallet
          </button>
          {type === "product" && cartData &&
            <button
              type="submit"
              onClick={handleCashOnDelivery}
              style={{
                padding: "10px",
                fontSize: "1rem",
                flex: 1, // Makes this button take equal space as the first one
                marginLeft: "1em"
              }}
            >
              Cash on Delivery
            </button>
          }
        </form>
        <Help />
      </div>
    </div>
  );
}

export default PaymentPage;
