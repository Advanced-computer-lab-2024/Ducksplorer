import React, { useEffect, useState, createContext, useRef } from "react";
import axios from "axios";
import { message } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CurrencyConvertor from "../../Components/CurrencyConvertor";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import {
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";

export const TagsContext = createContext();

const RUDItinerary = () => {
  const [itineraries, setItineraries] = useState([]); //holds the list of itineraries
  const [open, setOpen] = useState(false); //controls the confirmation message before deletion
  const [selectedItinerary, setselectedItinerary] = useState(""); //stores the currently selected itinerary for deletion
  const [editingItinerary, setEditingItinerary] = useState(null); //stores the currently selected itinerary for editing
  const [selectedTags, setSelectedTags] = useState([]); // For storing selected tags
  const [availableTags, setAvailableTags] = useState([]); // For storing fetched tags
  // const [loading, setLoading] = useState(true); //indicates if data is fetched
  const navigate = useNavigate();
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("EGP");
  const [activityExchangeRates, setActivityExchangeRates] = useState({});
  const [activityCurrency, setActivityCurrency] = useState("EGP");

  const [formData, setFormData] = useState({
    activity: {
      name: "",
      price: "",
      category: "",
      location: "",
    },
    activities: [],
    locations: [],
    timeline: "",
    language: "",
    price: "",
    availableDatesAndTimes: [],
    accessibility: "",
    pickUpLocation: "",
    dropOffLocation: "",
    rating: "",
    tag: {
      name: "",
    },
  });

  //Prepares the form for editing by populating it with the selected itinerary's data.
  const handleEditClick = (itinerary) => {
    setFormData({
      ...itinerary,
      activity: itinerary.activity || [],
      locations: itinerary.locations || [],
    });
    setSelectedTags(itinerary.tags || []); // Ensure selected tags are set from the itinerary
    setEditingItinerary(itinerary);

    navigate("/editItinerary", {
      state: {
        itinerary: itinerary,
        data: {
          ...itinerary,
          activity: itinerary.activity || [],
          locations: itinerary.locations || [],
        },
        tags: availableTags,
        tagsSelected: itinerary.tags || [],
      },
    });
  };

  const handleCurrencyChange = (rates, selectedCurrency) => {
    setExchangeRates(rates);
    setCurrency(selectedCurrency);
  };

  const handleActivityCurrencyChange = (rates, selectedCurrency) => {
    setActivityExchangeRates(rates);
    setActivityCurrency(selectedCurrency);
  };

  //updates general input fields based on user input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //updates location in formData based on input change
  const handleLocationInputChange = (event, index) => {
    const { value } = event.target;
    setFormData((prevData) => {
      const updatedLocations = [...prevData.locations];
      updatedLocations[index] = value;
      return { ...prevData, locations: updatedLocations };
    });
  };

  //updates activity in formData based on input change
  const handleActivityInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedActivities = [...prevData.activity];
      updatedActivities[index] = {
        ...updatedActivities[index],
        [name]: value,
      };
      return {
        ...prevData,
        activity: updatedActivities,
      };
    });
  };

  //adds a new activity object to the formData
  const addActivity = () => {
    setFormData((prevData) => ({
      ...prevData,
      activity: [
        ...prevData.activity,
        { name: "", price: "", category: "", location: "" },
      ],
    }));
  };

  //deletes an activity based on its index
  const deleteActivity = (index) => {
    const updatedActivities = formData.activity.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      activity: updatedActivities,
    }));
  };

  //updates available dates in formData based on input change
  const handleAvailableDatesInputChange = (event, index) => {
    const { value } = event.target;
    setFormData((prevData) => {
      const updatedDates = [...prevData.availableDatesAndTimes];
      updatedDates[index] = value;
      return { ...prevData, availableDatesAndTimes: updatedDates };
    });
  };

  const handleAddDate = () => {
    setFormData((prevData) => ({
      ...prevData,
      availableDatesAndTimes: [...prevData.availableDatesAndTimes, ""],
    }));
  };

  const handleAddLocation = () => {
    setFormData((prevData) => ({
      ...prevData,
      locations: [...prevData.locations, ""],
    }));
  };

  const handleDeleteDate = (index) => {
    const newDatesAndTimes = formData.availableDatesAndTimes.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, availableDatesAndTimes: newDatesAndTimes }); // Update state
  };

  const handleDeleteLocation = (index) => {
    const newLocations = formData.locations.filter((_, i) => i !== index);
    setFormData({ ...formData, locations: newLocations });
  };

  //for scrolling automatically when we click edit
  const formRef = useRef(null);

  useEffect(() => {
    if (editingItinerary && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [editingItinerary]);

  //update
  //submit the updated itinerary data.
  const handleUpdate = (event) => {
    event.preventDefault();

    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;

    const updatedData = {
      ...formData,
      tags: selectedTags,
    };

    console.log("Updated Data:", updatedData);

    axios
      .put(
        `http://localhost:8000/itinerary/${editingItinerary._id}`,
        updatedData
      )
      .then((response) => {
        if (userName) {
          return axios.get(
            `http://localhost:8000/itinerary/myItineraries/${userName}`
          );
        }
        throw new Error("User not found!");
      })
      .then((response) => {
        setItineraries(response.data);
        message.success("Itinerary updated successfully!");
        setEditingItinerary(null);
        setSelectedTags([]);
      })
      .catch((error) => {
        console.error(
          "Error updating itinerary or fetching itineraries!",
          error
        );
        message.error(
          `Error updating itinerary: ${error.response ? error.response.data.message : error.message
          }`
        );
      });
  };

  useEffect(() => {
    const storedTags = localStorage.getItem("selectedTags");
    if (storedTags) {
      setSelectedTags(JSON.parse(storedTags));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
  }, [selectedTags]);

  //read
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (userName) {
      axios
        .get(`http://localhost:8000/itinerary/myItineraries/${userName}`)
        .then((response) => {
          setItineraries(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the itineraries!", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const fetchAvailableTags = async () => {
      //setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/preferenceTags/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched Tags:", data);
        setAvailableTags(data); // Adjust based on data structure
      } catch (error) {
        console.error("Error fetching available tags:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchAvailableTags();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/itinerary/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        message.success("Itinerary deleted successfully!");
        setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
      })
      .catch((error) => {
        console.log(itineraries);
        message.error("There was an error deleting the itinerary!");
        console.error("There was an error deleting the itinerary!", error);
      });
  };

  const handleClickOpen = (itinerary) => {
    setselectedItinerary(itinerary);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setselectedItinerary(null);
  };

  const handleConfirmDelete = () => {
    if (selectedItinerary) {
      handleDelete(selectedItinerary);
    }
    handleClose();
  };

  //Updates the selectedTags state based on the user’s checkbox selections.
  const handleCheckboxChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag); // Remove tag if already selected
      } else {
        return [...prevSelectedTags, tag]; // Add tag if not already selected
      }
    });
  };

  async function toggleItineraryActiveStatus(itineraryId) {
    try {
      const response = await fetch(
        `http://localhost:8000/itinerary/toggleItineraryActiveStatus/${itineraryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle active status");
      }

      const data = await response.json();
      console.log(
        `New isDeactivated status after toggle: ${data.itinerary.isDeactivated}`
      );
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === itineraryId
            ? { ...itinerary, isDeactivated: !itinerary.isDeactivated }
            : itinerary
        )
      );
      return data.itinerary;
    } catch (error) {
      console.error("Error toggling itinerary active status:", error);
    }
  }
  useEffect(() => {
    // Apply styles to the body when the component mounts
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";

    // Clean up styles when the component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
      document.body.style.display = "";
      document.body.style.justifyContent = "";
      document.body.style.alignItems = "";
      document.body.style.height = "";
    };
  }, []);
  return (
    <>
      <Link to="/tourGuideDashboard"> Back </Link>
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Your Itineraries
      </Typography>
      <div
        className="overflow-x-auto"
        style={{
          height: "90vh",
          borderRadius: "3cap",
          width: "90vw",
          boxShadow:
            "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table striped style={{ borderRadius: "3cap" }}>
          <TableHead>
            <TableHeadCell>
              Activities
              <CurrencyConvertor
                onCurrencyChange={handleActivityCurrencyChange}
              />
            </TableHeadCell>
            <TableHeadCell>Locations</TableHeadCell>
            <TableHeadCell>Timeline</TableHeadCell>
            <TableHeadCell>Language</TableHeadCell>
            <TableHeadCell>
              Price
              <CurrencyConvertor onCurrencyChange={handleCurrencyChange} />
            </TableHeadCell>
            <TableHeadCell>Available Dates And Times</TableHeadCell>
            <TableHeadCell>Accessibility</TableHeadCell>
            <TableHeadCell>Pick Up Location</TableHeadCell>
            <TableHeadCell>Drop Off Location</TableHeadCell>
            <TableHeadCell>Ratings</TableHeadCell>
            <TableHeadCell>Tags</TableHeadCell>
            <TableHeadCell>Flag</TableHeadCell>
            <TableHeadCell>Active Status</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody>
            {
              itineraries.map((itinerary) =>
                itinerary.deletedItinerary === false ? (
                  <TableRow key={itinerary._id}>
                    <TableCell>
                      {itinerary.activity && itinerary.activity.length > 0
                        ? itinerary.activity.map((activity, index) => (
                          <div key={index}>
                            {activity.name || "N/A"} - Price:
                            {(
                              activity.price *
                              (activityExchangeRates[activityCurrency] || 1)
                            ).toFixed(2)}{" "}
                            {activityCurrency}
                            ,<br />
                            Location: {activity.location || "N/A"},<br />
                            Category: {activity.category || "N/A"}
                            <br />
                            <br />{" "}
                            {/* Adds an extra line break between activities */}
                          </div>
                        ))
                        : "No activities available"}
                    </TableCell>

                    <TableCell>
                      {itinerary.locations && itinerary.locations.length > 0
                        ? itinerary.locations.map((location, index) => (
                          <div key={index}>
                            <Typography variant="body1">
                              {index + 1}: {location.trim()}
                            </Typography>
                            <br />
                          </div>
                        ))
                        : "No locations available"}
                    </TableCell>

                    <TableCell>{itinerary.timeline}</TableCell>
                    <TableCell>{itinerary.language}</TableCell>
                    <TableCell>
                      {(
                        itinerary.price * (exchangeRates[currency] || 1)
                      ).toFixed(2)}{" "}
                      {currency}
                    </TableCell>
                    <TableCell>
                      {itinerary.availableDatesAndTimes.length > 0
                        ? itinerary.availableDatesAndTimes.map(
                          (dateTime, index) => {
                            const dateObj = new Date(dateTime);
                            const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD format
                            const time = dateObj.toTimeString().split(" ")[0]; // HH:MM:SS format
                            return (
                              <div key={index}>
                                Date {index + 1}: {date}
                                <br />
                                Time {index + 1}: {time}
                              </div>
                            );
                          }
                        )
                        : "No available dates and times"}
                    </TableCell>

                    <TableCell>{itinerary.accessibility}</TableCell>
                    <TableCell>{itinerary.pickUpLocation}</TableCell>
                    <TableCell>{itinerary.dropOffLocation}</TableCell>
                    <TableCell>
                      <Rating
                        value={itinerary.averageRating}
                        precision={0.1}
                        readOnly
                      />
                    </TableCell>

                    <TableCell>
                      {itinerary.tags && itinerary.tags.length > 0
                        ? itinerary.tags.map((tag, index) => (
                          <div key={index}>
                            {tag || "N/A"}
                            <br />
                            <br />
                          </div>
                        ))
                        : "No tags available"}
                    </TableCell>

                    <TableCell>
                      {itinerary.flag ? (
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
                      <Button
                        variant="contained"
                        color={itinerary.isDeactivated ? "success" : "error"} // it is not active this means the button will activate the itinerary which we want to be in color success (green)
                        onClick={() => {
                          console.log(
                            `Button clicked for itinerary ID: ${itinerary._id}`
                          ); //For debugging
                          toggleItineraryActiveStatus(itinerary._id);
                        }}
                      >
                        {itinerary.isDeactivated ? "Activate" : "Deactivate"}
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Delete Itinerary">
                        <IconButton
                          color="error"
                          aria-label="delete category"
                          onClick={() => handleClickOpen(itinerary._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Itinerary">
                        <IconButton
                          color="primary"
                          aria-label="edit category"
                          onClick={() => handleEditClick(itinerary)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ) : null
              ) //We don't output a row when the itinerary has been deleted but cannot be removed from the database since it is booked by previous tourists
            }
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Itinerary?
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
    </>
  );
};

export default RUDItinerary;
