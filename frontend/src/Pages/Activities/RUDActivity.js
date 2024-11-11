//This is no longer used

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import CurrencyConvertor from "../../Components/CurrencyConvertor.js";

import {
  Rating,
  Checkbox,
  FormControlLabel,
  IconButton,
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
  DialogContentText,
  DialogTitle,
  Tooltip,
  TextField,
} from "@mui/material";
import StandAloneToggleButton from "../../Components/ToggleButton.js";
const RUDActivity = () => {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    isOpen: false,
    category: "",
    tags: [],
    specialDiscount: "",
    date: "",
    duration: "",
    location: "",
    rating: "",
  });

  // Ref to the form for scrolling
  const formRef = useRef(null);

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  // Handle fetching activities
  useEffect(() => {
    const showPreferences = localStorage.getItem("showPreferences");
    const favCategory = localStorage.getItem("category");
    axios
      .get("http://localhost:8000/activity/", {
        params: {
          showPreferences,
          favCategory,
        },
      })
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the activities!", error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (activity) => {
    setFormData(activity); // Set form data to the selected activity's values
    setEditingActivity(activity);
  };

  // Scroll to the form whenever editingActivity is set
  useEffect(() => {
    if (editingActivity && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [editingActivity]);

  // Handle input change in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle checkbox change for 'isOpen'
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: checked }));
  };

  // Handle updating the activity
  const handleUpdate = (event) => {
    event.preventDefault();
    axios
      .patch(`http://localhost:8000/activity/${editingActivity._id}`, formData)
      .then(() => {
        setActivities(
          activities.map((activity) =>
            activity._id === editingActivity._id ? formData : activity
          )
        );
        message.success("Activity updated successfully!");
        setEditingActivity(null);
      })
      .catch((error) => message.error("Error updating activity!"));
  };

  // Handle delete activity
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/activity/${id}`)
      .then(() => {
        message.success("Activity deleted successfully!");
        setActivities(activities.filter((activity) => activity._id !== id));
      })
      .catch((error) => message.error("Error deleting activity!"));
  };

  // Open confirmation dialog for delete
  const handleClickOpen = (activity) => {
    setSelectedActivity(activity);
    setOpen(true);
  };

  // Close the confirmation dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedActivity(null);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (selectedActivity) {
      handleDelete(selectedActivity._id);
    }
    handleClose();
  };

  return (
    <>
      <Box sx={{ p: 6, maxWidth: "135vh", overflowY: "auto", height: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Typography variant="h4">Available activities</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>
                  Price
                  <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
                </TableCell>
                <TableCell>Is open</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Dates and Times</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Flag</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>
                    {(activity.price * (exchangeRates[currency] || 1)).toFixed(
                      2
                    )}{" "}
                    {currency}
                  </TableCell>
                  <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>{activity.tags}</TableCell>
                  <TableCell>{activity.specialDiscount}</TableCell>
                  <TableCell>
                    {activity.date
                      ? (() => {
                          const dateObj = new Date(activity.date);
                          const date = dateObj.toISOString().split("T")[0];
                          const time = dateObj.toTimeString().split(" ")[0];
                          return (
                            <div>
                              {date} at {time}
                            </div>
                          );
                        })()
                      : "No available date and time"}
                  </TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>
                    <Rating
                      value={calculateAverageRating(activity.ratings)}
                      precision={0.1}
                      readOnly
                    />
                  </TableCell>

                  <TableCell>
                    {" "}
                    {activity.flag ? (
                      <span
                        style={{
                          color: "red",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <WarningIcon style={{ marginRight: "4px" }} />
                        Inappropriate
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "green",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CheckCircleIcon style={{ marginRight: "4px" }} />
                        Appropriate
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Delete Activity">
                      <IconButton
                        color="error"
                        onClick={() => handleClickOpen(activity)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Activity">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(activity)}
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

        {editingActivity && (
          <form
            onSubmit={handleUpdate}
            style={{ marginTop: "20px" }}
            ref={formRef}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isOpen}
                  onChange={handleCheckboxChange}
                  name="isOpen"
                />
              }
              label="Is open"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Discount"
              name="specialDiscount"
              value={formData.specialDiscount}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="number"
            />
            <TextField
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              type="datetime-local"
            />
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Location"
              name="location"
              type="url"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Update Activity
            </Button>
          </form>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Activity?
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
      </Box>
    </>
  );
};

export default RUDActivity;
