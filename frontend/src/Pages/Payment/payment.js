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


  return (
    <>
      <h1>React Stripe and Payment with OTP</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Enter Card Details</button>

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleOtpVerification}>Verify OTP</button>
        </>

      )}
      {clientSecret && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading payment form...</p>
      )}
    </>
  );
}

export default Payment;