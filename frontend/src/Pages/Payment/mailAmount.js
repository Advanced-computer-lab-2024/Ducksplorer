import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "usd", email }),
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
        alert("Error creating payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  return (
    <div>
      <h1>Enter Payment Details</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PaymentPage;
