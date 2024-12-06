////This is the page that gets called for the advertiser to see HIS activities ONLY 
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { calculateAverageRating } from "../../Utilities/averageRating.js";
import StandAloneToggleButton from "../../Components/ToggleButton.js";
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TouristNavBar from "../../Components/TouristNavBar.js";
import Help from "../../Components/HelpIcon";
import Error404 from "../../Components/Error404.js";
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
import AdvertiserSidebar from "../../Components/Sidebars/AdvertiserSidebar.js";
const MyActivities = () => {
  // Accept userNameId as a prop
  const userName = JSON.parse(localStorage.getItem("user")).username;
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  let allTags = JSON.parse(localStorage.getItem("tags"));

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

  // Handle fetching activities by userName ID
  useEffect(() => {
    console.log(userName);
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/activity/my/${userName}`
        );
        setActivities(response.data);
      } catch (error) {
        console.error("There was an error fetching the activities!", error);
      }
    };
    fetchActivities();
  }, [userName]); // Depend on userNameId

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
    <Box
      sx={{
        height: "100vh",
        paddingTop: "64px",
        width: "90vw",
        marginLeft: "5vw",
      }}
    >
      <AdvertiserSidebar />
      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "40px" }}
      >
        <div style={{ overflowY: "visible", height: "100vh" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom
          >
            Activities
          </Typography>
          <br></br>
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
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Is open</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Tags</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Discount</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Dates and Times</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Duration</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Location</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Rating</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Flag</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => activity.deletedActivity === false ? (
                  <TableRow key={activity._id}>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.price}</TableCell>
                    <TableCell>{activity.isOpen ? "Yes" : "No"}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{activity.tags.join(", ")}</TableCell>
                    <TableCell>{activity.specialDiscount}</TableCell>
                    <TableCell>{activity.date ? (() => {
                      const dateObj = new Date(activity.date);
                      const date = dateObj.toISOString().split('T')[0];
                      const time = dateObj.toTimeString().split(' ')[0];
                      return (
                        <div>
                          {date} at {time}
                        </div>
                      );
                    })()
                      : 'No available date and time'}</TableCell>
                    <TableCell>{activity.duration}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>
                      <Rating
                        value={calculateAverageRating(activity.ratings)}
                        precision={0.1}
                        readOnly
                      />
                    </TableCell>

                    <TableCell> {activity.flag ? (
                      <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                        <WarningIcon style={{ marginRight: '4px' }} />
                        Inappropriate
                      </span>
                    ) : (
                      <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon style={{ marginRight: '4px' }} />
                        Appropriate
                      </span>
                    )}</TableCell>

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
                ) : <Error404 route={"/advertiserDashboard"} errorMessage={"The activities you are looking for might be removed or is temporarily unavailable"} backMessage={"Back to Dashboard"} />)
                }
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {allTags.map((element) => {
                  return (
                    <StandAloneToggleButton
                      key={element._id}
                      name={element.name}
                      tags={formData.tags}
                    />
                  );
                })}
              </div>
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
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" className="blackhover">
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
        </div>
        <Help />
      </div>
    </Box >
  );
};

export default MyActivities;
