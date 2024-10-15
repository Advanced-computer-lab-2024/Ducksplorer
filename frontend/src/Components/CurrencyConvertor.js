import React, { useState, useEffect } from 'react';

const CurrencyConvertor = ({ onCurrencyChange }) => {
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/EGP`);
        const data = await response.json();
        setExchangeRates(data.rates);
        onCurrencyChange(data.rates, currency);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, [currency, onCurrencyChange]);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    onCurrencyChange(exchangeRates, event.target.value);
  };

  return (
    <div>
      <select value={currency} onChange={handleCurrencyChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="EGP">EGP</option>
        {/* Add more currencies as needed */}
      </select>
    </div>
  );
};

export default CurrencyConvertor;