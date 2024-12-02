import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout.js";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Fetch publishable key on load
    fetch("http://localhost:8000/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const handlePayment = async () => {
    // Send the payment request to backend
    const response = await fetch("http://localhost:8000/payment/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "usd", email }),
    });
    const data = await response.json();
    setClientSecret(data.clientSecret);
    setOtpSent(true);
    console.log(clientSecret);
  };

  const handleOtpVerification = async () => {
    const response = await fetch("http://localhost:8000/payment/confirm-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    console.log(response);
    const data = await response.json();

    if (data.message === "OTP verified") {
      alert("OTP verified. You can now proceed with the payment.");

      // Send confirmation after OTP verification
      const confirmationResponse = await fetch("http://localhost:8000/payment/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const confirmationData = await confirmationResponse.json();

      if (confirmationData.message === "Confirmation sent") {
        alert("Confirmation email sent successfully.");
      } else {
        alert("Failed to send confirmation email. Please try again.");
      }

    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
return(
  <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  }}
>
  {/* Page Title */}
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "#3f51b5",
      textAlign: "center",
      marginBottom: "32px",
      textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)",
    }}
  >
    React Stripe Payment with OTP
  </Typography>

  {/* Input Fields */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    }}
  >
    <TextField
      label="Email"
      type="email"
      placeholder="Enter your email"
      variant="outlined"
      fullWidth
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <TextField
      label="Amount"
      type="number"
      placeholder="Enter amount"
      variant="outlined"
      fullWidth
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handlePayment}
      fullWidth
      sx={{
        padding: "12px",
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "none",
      }}
    >
      Enter Card Details
    </Button>
  </Box>

  {/* OTP Section */}
  {otpSent && (
    <Box
      sx={{
        marginTop: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TextField
        label="OTP"
        type="text"
        placeholder="Enter OTP"
        variant="outlined"
        fullWidth
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOtpVerification}
        fullWidth
        sx={{
          padding: "12px",
          fontSize: "16px",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Verify OTP
      </Button>
    </Box>
  )}

  {/* Payment Form */}
  {clientSecret && stripePromise ? (
    <Box
      sx={{
        marginTop: "24px",
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </Box>
  ) : (
    clientSecret && (
      <Box
        sx={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    )
  )}
</Box>
);
}

export default Payment;