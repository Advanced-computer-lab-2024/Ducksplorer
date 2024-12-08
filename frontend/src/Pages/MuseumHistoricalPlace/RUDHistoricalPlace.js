//This file contains everything related to what the tourism governor can do with the historical places: see his created historical visits, create tags, update and delete his visits
import { IconButton, DialogContentText } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Tooltip, Select } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CurrencyConvertor from "../../Components/CurrencyConvertor";

import {
  Box,
  Button,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import GovernorNavBar from '../../Components/NavBars/GovernorNavBar';

const RUDHistoricalPlace = () => {
  const navigate = useNavigate();
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedHistoricalPlace, setSelectedHistoricalPlace] = useState(null);
  const [editingHistoricalPlace, setEditingHistoricalPlace] = useState(null);
  const [historicalPlaceTagsOptions, setHistoricalPlaceTagsOptions] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");

  const [formData, setFormData] = useState({
    description: "",
    pictures: "",
    location: "",
    ticketPrices: "",
    openingTime: "",
    closingTime: "",
    HistoricalPlaceDate: "",
    HistoricalPlaceName: "",
    HistoricalPlaceCategory: "",
    tags: [],
    // createdBy: ''
  });
  // const [createdBy, setCreatedBy] = useState("alya");
  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    const userJson = localStorage.getItem("user"); // Get the 'user' item as a JSON string to get the currently logged in user
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (userName) {
      axios
        .get(
          `http://localhost:8000/historicalPlace/getAllMyHistoricalPlaces/${userName}`
        )
        .then((response) => {
          setHistoricalPlaces(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the historical places!",
            error
          );
        });
    }
  }, []);

  useEffect(() => {
    //fetching all the tags because they will be used in the dropdown that appears when we try to  edit the tags of a particular historical visit
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/historicalPlaceTags/getAllHistoricalPlaceTags"
        );
        const data = await response.json();
        setHistoricalPlaceTagsOptions(data); // Store the fetched tags
      } catch (error) {
        console.error("Error fetching historical place tags:", error);
        message.error("Failed to load historical place tags.");
      }
    };

    fetchTags();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Responsible for when the user clicks on edit icon
  const handleEditClick = (historicalPlace) => {
    localStorage.setItem("selectedHistoricalPlace", JSON.stringify(historicalPlace));
    setEditingHistoricalPlace(historicalPlace); // Update editing state
    setFormData(historicalPlace); // Pre-fill form data
    navigate(`/editHistoricalPlace`);
};

  // When the delete icon is clicked a popup saying are you sure appears, this method opens it
  const handleClickOpen = (historicalPlace) => {
    setSelectedHistoricalPlace(historicalPlace);
    setOpen(true);
  };

  //Calls the backend to actually delete
  const handleDelete = (id) => {
    axios
      .delete(
        `http://localhost:8000/historicalPlace/deleteHistoricalPlace/${id}`
      )
      .then(() => {
        setHistoricalPlaces(
          historicalPlaces.filter(
            (historicalPlace) => historicalPlace._id !== id
          )
        );
        message.success("Historical Place deleted successfully!");
      })
      .catch((error) => {
        message.error("There was an error deleting the historical place!");
        console.error("Error deleting historical place!", error);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedHistoricalPlace(null);
  };

  const handleConfirmDelete = () => {
    if (selectedHistoricalPlace) {
      handleDelete(selectedHistoricalPlace._id);
    }
    handleClose();
  };

  // Navigate to page to add a tag for historical places
  const goToUpcomingPage = () => {
    navigate("/CreateTagHistoricalPlace");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
        width: "90vw",
        marginLeft: "5vw",
      }}
    >
      {/* Navbar */}
      <GovernorNavBar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1, // Take the remaining width
          padding: "32px", // Inner padding
          margin: "0 auto", // Center content horizontally
          borderRadius: "12px", // Rounded corners
        }}
      >
        {/* Page Title */}
        <div
          style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
        >
          <div style={{ overflowY: "visible", height: "100vh" }}>
            <Typography
              variant="h2"
              sx={{ textAlign: "center", fontWeight: "bold" }}
              gutterBottom className="bigTitle">
              Available Historical Place Visits</Typography>
            {/* Button to navigate to page to create tags */}
            <br></br>
            {/* Button to navigate to page to create tags */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Button
                variant="contained"
                className="blackhover" onClick={goToUpcomingPage}
              >
                Create Tag for Historical Place Visits
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                marginBottom: 4,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                borderRadius: "1.5cap",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Description</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Location</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Pictures</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      Ticket Price
                      <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Opening Time</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Closing Time</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Category</TableCell>
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Tags</TableCell>
                    {/* <TableCell>Created By</TableCell> */}
                    <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historicalPlaces.map((historicalPlace) => (
                    <TableRow key={historicalPlace._id}>
                      <TableCell>{historicalPlace.description}</TableCell>
                      <TableCell>{historicalPlace.location}</TableCell>
                      <TableCell>
                        <img
                          src={historicalPlace.pictures}
                          alt="Historical Place"
                          style={{
                            width: "100px",
                            height: "auto",
                            objectFit: "cover",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {(
                          historicalPlace.ticketPrices *
                          (exchangeRates[currency] || 1)
                        ).toFixed(2)}{" "}
                        {currency}
                      </TableCell>
                      <TableCell>{historicalPlace.openingTime}</TableCell>
                      <TableCell>{historicalPlace.closingTime}</TableCell>
                      <TableCell>{historicalPlace.HistoricalPlaceDate}</TableCell>
                      <TableCell>{historicalPlace.HistoricalPlaceName}</TableCell>
                      <TableCell>
                        {historicalPlace.HistoricalPlaceCategory}
                      </TableCell>
                      <TableCell>{historicalPlace.tags.join(", ")}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete Historical Place">
                          <IconButton
                            color="error"
                            onClick={() => handleClickOpen(historicalPlace)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Historical Place">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(historicalPlace)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Confirmation Dialog for Deletion */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this historical place?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Box>
    </Box >
  );
}

export default RUDHistoricalPlace;
