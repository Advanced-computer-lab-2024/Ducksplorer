import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm.js";
import { loadStripe } from "@stripe/stripe-js";
import "./payment.css"; // Import CSS file

const Payment = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/payment/config").then(async (response) => {
      const { publishableKey } = await response.json();
      setStripePromise(loadStripe(publishableKey));
    });

    const storedClientSecret = localStorage.getItem("clientSecret");
    if (storedClientSecret) {
      setClientSecret(storedClientSecret);
    }
  }, []);

  return (
    <div style={{ width: "50vw" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "30px" }}
        className="bigTitle"
      >
        Payment 
      </h1>
      {clientSecret && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <div className="payment-wrapper">
            <CheckoutForm />
          </div>
        </Elements>
      ) : (
        <p>Loading payment form...</p>
      )}
    </div>
  );
};

export default Payment;
