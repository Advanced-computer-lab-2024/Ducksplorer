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
    minHeight: "100vh",
    backgroundColor: "#ffffff", // Subtle background color
    paddingTop: "64px", // Adjust for navbar height
    overflowY: "auto", // Enable scrolling if content overflows
    display: "flex", // Layout for alignment
    width:"130"
  }}
>
  {/* Navbar */}
  <AdminNavbar />
  <Sidebar />

  {/* Main Content */}
  <Box
    sx={{
      flex: 1, // Take up remaining space
      padding: "32px", // Consistent padding
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "1200px", // Restrict content width
      margin: "0 auto", // Center content
      backgroundColor: "#ffffff", // White background for main content
      borderRadius: "12px", // Rounded corners
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
    }}
  >
    {/* Page Title */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        color: "#3f51b5", // Primary color
        textAlign: "center",
        marginBottom: "24px", // Space below title
      }}
    >
      Available Tags
    </Typography>

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
          color="primary"
          onClick={() => handleAdd(newTag)}
          sx={{
            borderRadius: "8px",
            padding: "10px 24px",
            textTransform: "none",
            fontWeight: "bold",
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
        borderRadius: "12px", // Rounded corners for table
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
        overflow: "hidden", // Prevent content overflow
      }}
    >
      <Table>
        <TableHead
          sx={{
            backgroundColor: "#3f51b5", // Header background color
          }}
        >
          <TableRow>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
            >
              Tag
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
            >
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
              <TableCell>
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
              <TableCell>
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
    </TableContainer>

    {/* Add New Tag Button */}
    <Tooltip title="Add New Tag">
      <IconButton
        color="success"
        aria-label="add tag"
        onClick={handleAddtagClick}
        sx={{
          marginTop: "24px",
          backgroundColor: "#4caf50",
          color: "white",
          "&:hover": {
            backgroundColor: "#388e3c",
          },
        }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>

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
  </Box>
</Box>
  );
}

export default PreferenceTags;
