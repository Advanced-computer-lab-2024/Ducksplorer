import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { Card, Typography, Space, message, Select, Form, Button } from 'antd';
const { Title } = Typography
const { Option } = Select;

function PaymentPage() {
  const [itineraryData, setItineraryData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [price, setPrice] = useState('');
  const [type, setType] = useState(null);
  const [email, setEmail] = useState(JSON.parse(localStorage.getItem('user')).email);
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const [chosenDate, setChosenDate] = useState(null);

  const handleVisaSubmit = async (e) => {
    if (itineraryData && !chosenDate) {
      message.error("Please select a date and time before proceeding.");
      return;  // Prevent form submission if no date is selected
    }
    const userJson = localStorage.getItem('user');
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
    const amountInCents = price;
    const email = user.email;
    try {
      const response = await fetch("http://localhost:8000/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents, currency: "usd", email: email }),
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
    if (itineraryData && !chosenDate) {
      message.error("Please select a date and time before proceeding.");
      return;  // Prevent form submission if no date is selected
    }
    const userJson = localStorage.getItem('user');
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
    const activityId = localStorage.getItem('activityId');
    const itineraryId = localStorage.getItem('itineraryId');
    const itineraryOrActivity = localStorage.getItem('type');
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/touristRoutes/payWallet/${userName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        message.success("Payment successfully completed!");
        // Payment succeeded; now create the booking in the backend
        const bookingResponse = await fetch(`http://localhost:8000/touristRoutes/booking/${userName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityId: activityId, itineraryId: itineraryId, type: itineraryOrActivity }),
        });
        const bookingResult = await bookingResponse.json();
        console.log("Booking Result", bookingResult);

        if (bookingResult.status === 200) {
          console.log("Booking successfully created:", bookingResult);

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
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        message.error("User is not logged in.");
        return null;
      }
      const user = JSON.parse(userJson);
      if (!user || !user.username) {
        message.error("User information is missing.");
        return null;
      }

      const itineraryOrActivity = localStorage.getItem('type');
      const activityId = localStorage.getItem('activityId');
      const itineraryId = localStorage.getItem('itineraryId');

      if (!itineraryOrActivity) {
        message.error("Type information is missing.");
        return null;
      }

      //setEmail(email);
      setType(itineraryOrActivity);

      let response;

      if (itineraryOrActivity === 'itinerary' && itineraryId) {
        response = await axios.get(`http://localhost:8000/touristRoutes/viewDesiredItinerary/${itineraryId}`);
        if (response.status === 200) {
          setItineraryData(response.data);
          setPrice(response.data.price);
          localStorage.setItem('price', price);
        } else {
          message.error("Failed to retrieve itinerary details.");
        }
      }
      else if (itineraryOrActivity === 'activity' && activityId) {
        console.log("Fetching activity data for ID:", activityId); // Debugging
        response = await axios.get(`http://localhost:8000/touristRoutes/viewDesiredActivity/${activityId}`);
        if (response.status === 200) {
          console.log("Activity data fetched:", response.data); // Debugging
          setActivityData(response.data);
          setPrice(response.data.price);
          localStorage.setItem('price', price);
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
    const itineraryId = localStorage.getItem('itineraryId');

    try {
      const response = await fetch(`http://localhost:8000/itinerary/updateDate/${itineraryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chosenDate: value }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Updated itinerary:", data);
      } else {
        console.error("Failed to update chosen date:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating chosen date:", error);
    }
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    // Perform the next action here, such as navigating to another page
  };

  useEffect(() => {
    handleDisplayBooked();
  }, [type]);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '1500px',
      margin: 'auto',
      gap: '1rem',
      overflowY: 'visible',
      height: '120vh'
    }}>

      <div>
        {itineraryData || activityData ? (
          type === 'itinerary' ? (
            <div>
              <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <Title level={3}>Booked Details</Title>
                  <p><strong>Itinerary Details:</strong> {itineraryData.name}</p>
                  {/* Looping through the activities */}
                  {itineraryData.activity && itineraryData.activity.length > 0 ? (
                    itineraryData.activity.map((activity, index) => (
                      <div key={index}>
                        <p><strong>Activity Name:</strong> {activity.name}</p>
                        <p><strong>Activity Price:</strong> {activity.price}</p>
                      </div>
                    ))
                  ) : (
                    <p>No activities found.</p>
                  )}
                  <p><strong>Locations:</strong> {itineraryData.locations.join(', ')}</p>
                  <p><strong>Timeline:</strong> {itineraryData.timeline}</p>
                  <p><strong>Language:</strong> {itineraryData.language}</p>
                  <p><strong>Price:</strong> {itineraryData.price}</p>
                  <p><strong>Available Dates and Times:</strong> {itineraryData.availableDatesAndTimes.length > 0
                    ? itineraryData.availableDatesAndTimes.map((dateTime, index) => {
                      const dateObj = new Date(dateTime);
                      const date = dateObj.toISOString().split('T')[0];
                      const time = dateObj.toTimeString().split(' ')[0];
                      return (
                        <div key={index}>
                          Date {index + 1}: {date}<br />
                          Time {index + 1}: {time}
                        </div>
                      );
                    })
                    : 'No available dates and times'}</p>
                  <p><strong>Accessibility:</strong> {itineraryData.accessibility}</p>
                  <p><strong>Pick Up Location:</strong> {itineraryData.pickUpLocation}</p>
                  <p><strong>Drop Off Location:</strong> {itineraryData.dropOffLocation}</p>
                  <p><strong>Rating:</strong> {itineraryData.rating}/5</p>
                  <p><strong>Tags:</strong> {itineraryData.tags}</p>
                </Space>
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
                  rules={[{ required: true, message: 'Please select a date and time!' }]}
                >
                  <Select
                    placeholder="Select a Date and Time"
                    onChange={handleDateChange}
                    style={{ width: '100%' }}
                  >
                    {itineraryData?.availableDatesAndTimes
                      .filter(dateTime => {
                        const currentDate = new Date();  // Get the current date and time
                        const dateObj = new Date(dateTime);  // Convert available date to Date object
                        return dateObj >= currentDate;  // Only keep dates in the future or equal to now
                      })
                      .map((dateTime, index) => {
                        const dateObj = new Date(dateTime);
                        const date = dateObj.toISOString().split('T')[0];
                        const time = dateObj.toTimeString().split(' ')[0];
                        const displayText = `${date} at ${time}`;

                        return (
                          <Option key={index} value={dateTime} required>
                            {displayText}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <p><strong>Selected Date and Time:</strong> {chosenDate ? new Date(chosenDate).toLocaleString() : 'None selected'}</p>

                <h1>Enter Payment Details</h1>

                <p>Email</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value * 100)}
                  required
                  readOnly
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />

                <p>Amount</p>
                <input
                  type="number"
                  placeholder="Amount"
                  value={price}
                  onChange={(e) => setAmount(e.target.value * 100)}
                  required
                  readOnly
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />

              </Form>
            </div>
          ) : type === 'activity' && activityData ? (
            <div>
              <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <Title level={3}>Booked Details</Title>
                  <p><strong>Activity Details:</strong> </p>
                  <p><strong>Activity Name:</strong> {activityData.name}</p>
                  <p><strong>Price:</strong> {activityData.price}</p>
                  <p><strong>Is Open:</strong> {activityData.isOpen ? 'Yes' : 'No'}</p>
                  <p><strong>Category:</strong> {activityData.category}</p>
                  <p><strong>Tags:</strong> {activityData.tags}</p>
                  <p><strong>Special Discount:</strong> {activityData.specialDiscount}</p>
                  <p><strong>Date and Time:</strong> {activityData.date
                    ? (() => {
                      const dateObj = new Date(activityData.date);
                      const date = dateObj.toISOString().split('T')[0];
                      const time = dateObj.toTimeString().split(' ')[0];
                      return (
                        <div>
                          {date} at {time}
                        </div>
                      );
                    })()
                    : 'No available date and time'}</p>
                  <p><strong>Duration:</strong> {activityData.duration}</p>
                  <p><strong>Location:</strong> {activityData.location}</p>
                  <p><strong>Ratings:</strong> {activityData.averageRating}/5</p>
                </Space>
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
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <p>Amount</p>
                <input
                  type="number"
                  placeholder="Amount"
                  value={price}
                  onChange={(e) => setAmount(e.target.value * 100)}
                  required
                  readOnly
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />

              </Form>
            </div>
          ) : null
        ) : (
          <p>Loading booking details...</p>
        )}
      </div>
      <form style={{ display: 'flex', width: '100%' }}>
        <button
          type="submit"
          onClick={handleVisaSubmit}
          style={{
            padding: '10px',
            fontSize: '1rem',
            flex: 1,  // Ensures both buttons take equal space
            marginRight: '12px'  // Adds space between the buttons
          }}
        >
          Visa
        </button>
        <button
          type="submit"
          onClick={handleWalletSubmit}
          style={{
            padding: '10px',
            fontSize: '1rem',
            flex: 1  // Makes this button take equal space as the first one
          }}
        >
          Wallet
        </button>
      </form>


    </div >

  );
}

export default PaymentPage;
