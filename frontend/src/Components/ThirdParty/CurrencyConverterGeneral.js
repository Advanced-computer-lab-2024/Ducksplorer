import React, { useEffect, useState } from 'react';
import { TextField, Box, Autocomplete } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledBox = styled(Box)({
  marginBottom: '16px',
  maxWidth: '300px',
  margin: 'auto',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    fontSize: '14px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
  },
});

const CurrencyConverterGeneral = ({ onCurrencyChange, initialCurrency }) => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState(initialCurrency);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${initialCurrency}`);
        setExchangeRates(response.data.rates);
        setAvailableCurrencies(Object.keys(response.data.rates));
        onCurrencyChange(response.data.rates, initialCurrency);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, [initialCurrency, onCurrencyChange]);

  const handleCurrencyChange = (event, newValue) => {
    const selectedCurrency = newValue;
    setCurrency(selectedCurrency);
    onCurrencyChange(exchangeRates, selectedCurrency);
  };

  return (
    <StyledBox>
      <Autocomplete
        options={availableCurrencies}
        value={currency}
        onChange={handleCurrencyChange}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label="Currency"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </StyledBox>
  );
};

export default CurrencyConverterGeneral;