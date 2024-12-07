import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import AdminNavbar from "../../Components/TopNav/Adminnavbar.js";
import {
  TextField,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Sidebar from "../../Components/Sidebars/Sidebar.js";
const PreferenceTags = () => {
  const [tags, setTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTag, setselectedTag] = useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [editedTagName, setEditedTagName] = useState("");

  const handleAddtagClick = () => {
    setShowTextField(!showTextField);
  };

  const handletagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag);
    setEditedTagName(tag.name);
  };

  const handleEdittagChange = (event) => {
    setEditedTagName(event.target.value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/preferenceTags")
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tags!", error);
      });
  }, []);

  const handleDelete = (Name) => {
    fetch("http://localhost:8000/preferenceTags", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: Name }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        message.success("tag deleted successfully!");
        setTags(tags.filter((tag) => tag.name !== Name));
      })
      .catch((error) => {
        console.log(tags);
        message.error("There was an error deleting the tag!");
        console.error("There was an error deleting the tag!", error);
      });
  };

  const handleEdit = (oldName, Name) => {
    axios
      .put("http://localhost:8000/preferenceTags", {
        currentName: oldName,
        newName: Name,
      })
      .then((response) => {
        setTags(
          tags.map((tag) =>
            tag.name === editingTag.name ? { ...tag, name: editedTagName } : tag
          )
        );
        setEditingTag(null);
        setEditedTagName("");
        message.success("tag updated successfully!");
      })
      .catch((error) => {
        message.error("There was an error updating the tag!");
        console.error("There was an error updating the tag!", error);
      });
  };

  const handleAdd = (Name) => {
    axios
      .post("http://localhost:8000/preferenceTags", { name: Name })
      .then((response) => {
        setTags([...tags, response.data]);
        message.success("tag added successfully!");
        setShowTextField(false);
        setNewTag("");
      })
      .catch((error) => {
        message.error("There was an error adding the tag!");
        console.error("There was an error adding the tag!", error);
      });
  };

  const handleClickOpen = (tag) => {
    setselectedTag(tag);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setselectedTag(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTag) {
      handleDelete(selectedTag);
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        height: "auto",
        paddingTop: "64px",
        width: "120vw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {/* Navbar */}
      <AdminNavbar />
      <Sidebar />

      {/* Main Content */}
      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "10%" }}
      >
        <div style={{ overflowY: "visible", height: "auto" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom
          >
            Available Tags
          </Typography>
          <br></br>

          {/* Add New Tag */}
          {showTextField && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px", // Space below the field
              }}
            >
              <TextField
                label="New Tag"
                variant="outlined"
                value={newTag}
                onChange={handletagChange}
                sx={{
                  marginRight: "16px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => handleAdd(newTag)}
                className="blackhover"
                sx={{
                  borderRadius: "8px",
                  padding: "10px 24px",
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                Add
              </Button>
            </Box>
          )}

          {/* Table for Tags */}
          <TableContainer
            component={Paper}
            sx={{
              width: "80vw",
              borderRadius: "12px", // Rounded corners
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
              overflow: "hidden", // Ensure no scroll bars
            }}
          >
            <Table>
              <TableHead
              >
                <TableRow>
                  <TableCell
                    sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }}
                  >
                    Tag
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }}                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.map((tag, index) => (
                  <TableRow
                    key={tag._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // Alternate row colors
                      "&:hover": {
                        backgroundColor: "#f1f1f1", // Highlight on hover
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "15px", textAlign: "center", verticalAlign: "middle" }}>
                      {editingTag && editingTag.name === tag.name ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            value={editedTagName}
                            onChange={handleEdittagChange}
                            autoFocus
                            sx={{
                              marginRight: "16px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEdit(tag.name, editedTagName)}
                            sx={{
                              borderRadius: "8px",
                              padding: "6px 16px",
                              textTransform: "none",
                            }}
                          >
                            Confirm
                          </Button>
                        </Box>
                      ) : (
                        tag.name
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>
                      <Tooltip title="Delete Tag">
                        <IconButton
                          color="error"
                          aria-label="delete tag"
                          onClick={() => handleClickOpen(tag.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Tag">
                        <IconButton
                          color="primary"
                          aria-label="edit tag"
                          onClick={() => handleEditClick(tag)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Add New Tag Button */}
            <Box
              sx={{
                display: "flex", // Use flexbox
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                height: "8vh", // Optional: full viewport height for vertical centering
              }}
            >
              <Tooltip title="Add New Tag">
                <IconButton
                  aria-label="add category"
                  onClick={handleAddtagClick}
                  className="blackhover"
                  sx={{
                    color: "white"
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {/* Confirmation Dialog */}
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{
                "& .MuiDialog-paper": {
                  borderRadius: "12px", // Rounded corners
                  padding: "16px", // Inner padding
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#f44336", // Red for emphasis
                }}
              >
                Confirm Deletion
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this tag?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#d6d6d6" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  sx={{
                    backgroundColor: "#f44336",
                    color: "white",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </TableContainer>
        </div>
      </div>
    </Box>
  );
}

export default PreferenceTags;
