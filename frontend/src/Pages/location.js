import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Modal, Typography } from "@mui/material";
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Set default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const ClinicLocation = () => {
  const [locationAddress, setLocationAddress] = useState("");
  const [locationNeighborhood, setLocationNeighborhood] = useState("");
  const [locationRegion, setLocationRegion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const mapContainer = useRef(null);
  let mapInstance;
  let mapMarker;

  const fetchAddress = (latitude, longitude) => {
    setIsAddressLoading(true);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then((response) => response.json())
      .then((data) => {
        setLocationAddress(data.display_name);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsAddressLoading(false));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('selectedLocation', locationAddress); // Save location to localStorage
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
    window.location.href = "../activity/addActivity"; // Change to your desired action
};


  useEffect(() => {
    const initialCoordinates = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt
    mapInstance = L.map(mapContainer.current).setView([initialCoordinates.lat, initialCoordinates.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapInstance.on("click", function (event) {
      if (mapMarker) {
        mapInstance.removeLayer(mapMarker);
      }
      mapMarker = L.marker(event.latlng).addTo(mapInstance); // Use default marker icon here
      setLocationAddress("Fetching address...");
      fetchAddress(event.latlng.lat, event.latlng.lng);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <Box className="container3" sx={{ mt: 10, px: 5, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Mark the location of your clinic on the map
      </Typography>
      <Box
        ref={mapContainer}
        sx={{
          height: 400,
          width: 1000,
          mb: 2,
          bgcolor: "#f0f0f0",
        }}
      />

      <form id="clinicForm" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <TextField fullWidth label="Location Address" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} required sx={{ mb: 2 }} />
        </div>
     
        <Button type="submit" variant="contained" color="secondary" className="btn-secondary">
          Submit
        </Button>
      </form>

      {/* Confirmation Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h5">Success</Typography>
          <Typography>Your location has been recorded</Typography>
          <Button onClick={closeModal} color="secondary">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ClinicLocation;