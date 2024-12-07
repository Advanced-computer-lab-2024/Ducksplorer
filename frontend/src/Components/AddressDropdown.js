import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, TextField, Select, MenuItem, Box } from "@mui/material";

const AddressDropdown = ({ onAddressSelect, onAddAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const userJson = localStorage.getItem("user"); // Get the logged-in user's details
  const user = JSON.parse(userJson);
  const userName = user.username;
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/touristRoutes/addresses/${userName}`);
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  },);

  // Handle dropdown change
  const handleAddressChange = (e) => {
    const selected = e.target.value;
    setSelectedAddress(selected);
    onAddressSelect(selected); // Pass the selected address back to parent component
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (
      newAddress.street &&
      newAddress.city &&
      newAddress.country &&
      newAddress.postalCode
    ) {
      try {
        const response = await axios.post(
          `http://localhost:8000/touristRoutes/newAddress/${userName}`,
          newAddress
        );
        console.log("res is", response.data);
        setAddresses((prev) => [...prev, newAddress]); // Add new address to the list
        onAddAddress(newAddress); // Notify parent component
        setNewAddress({
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        }); // Reset form
        setShowForm(false); // Hide the form after submission
      } catch (error) {
        console.error("Error adding address:", error);
      }
    } else {
      alert("Please fill in all required fields!");
    }
  };


  return (
    <div>
      <label htmlFor="addressDropdown" style={{ width: "100%", textAlign: "left", fontWeight: "bold" }}>Choose a delivery address:</label>
      <select
        id="addressDropdown"
        value={selectedAddress}
        onChange={handleAddressChange}
        style={{ margin: "10px 0", padding: "8px", width: "100%" }}
      >
        <option value="" disabled>
          Select an address
        </option>
        {addresses.length > 0 ? (addresses.map((address, index) => (
          <option key={index} value={index}>
            {`${address.street}, ${address.city}, ${address.state || ""}, ${address.country} (${address.postalCode})`}
          </option>
        ))) : (
          <Typography> No Addresses Yet </Typography>
        )}
      </select>
      <Button
        onClick={() => setShowForm(!showForm)}

        style={{
          marginTop: "10px", width: "100%", backgroundColor: "#ff9933",
          boxShadow: "0"
        }}
        className="blackhover"
        type="submit"
      >
        {showForm ? "Cancel" : "Add New Address"}
      </Button>
      {
        showForm &&
        <>
          <Typography variant="h6" mt={2} style={{
            padding: "2px"
          }}>
            Add a New Address:
          </Typography>
          <form onSubmit={handleAddAddress}>
            <TextField
              label="Street"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Country"
              value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Postal Code"
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <Button onClick={handleAddAddress}
              variant="contained"
              style={{
                marginTop: "10px", width: "100%", backgroundColor: "#ff9933"
              }}
              className="blackhover"
              zIndex={2}
              type="submit">
              Add Address
            </Button>
          </form>
        </>
      }
    </div >
  );
};

export default AddressDropdown;
