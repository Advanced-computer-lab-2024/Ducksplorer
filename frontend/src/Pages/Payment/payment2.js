import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm.js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Fetch the publishable key for Stripe only once
    fetch("http://localhost:8000/payment/config").then(async (response) => {
      const { publishableKey } = await response.json();
      setStripePromise(loadStripe(publishableKey));
    });

    // Retrieve clientSecret from localStorage on component mount
    const storedClientSecret = localStorage.getItem("clientSecret");
    if (storedClientSecret) {
      setClientSecret(storedClientSecret);
    }
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {clientSecret && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading payment form...</p>
      )}
    </>
  );
};

export default Payment;
