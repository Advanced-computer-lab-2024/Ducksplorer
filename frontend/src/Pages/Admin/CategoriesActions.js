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

const DeleteCategory = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setselectedCategory] = useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const handleAddCategoryClick = () => {
    setShowTextField(!showTextField);
  };

  const handleCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
  };

  const handleEditCategoryChange = (event) => {
    setEditedCategoryName(event.target.value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/adminActivity/all")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  const handleDelete = (Name) => {
    fetch("http://localhost:8000/adminActivity", {
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
        message.success("Category deleted successfully!");
        setCategories(categories.filter((category) => category.name !== Name));
      })
      .catch((error) => {
        console.log(categories);
        message.error("There was an error deleting the category!");
        console.error("There was an error deleting the category!", error);
      });
  };

  const handleEdit = (oldName, Name) => {
    axios
      .put("http://localhost:8000/adminActivity", {
        currentName: oldName,
        newName: Name,
      })
      .then((response) => {
        setCategories(
          categories.map((category) =>
            category.name === editingCategory.name
              ? { ...category, name: editedCategoryName }
              : category
          )
        );
        setEditingCategory(null);
        setEditedCategoryName("");
        message.success("Category updated successfully!");
      })
      .catch((error) => {
        message.error("There was an error updating the category!");
        console.error("There was an error updating the category!", error);
      });
  };

  const handleAdd = (Name) => {
    axios
      .post("http://localhost:8000/adminActivity", { name: Name })
      .then((response) => {
        setCategories([...categories, response.data]);
        message.success("Category added successfully!");
        setShowTextField(false);
        setNewCategory("");
      })
      .catch((error) => {
        message.error("There was an error adding the category!");
        console.error("There was an error adding the category!", error);
      });
  };

  const handleClickOpen = (category) => {
    setselectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setselectedCategory(null);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      handleDelete(selectedCategory);
    }
    handleClose();
  };

  return (
<Box
  sx={{
    minHeight: "100vh",
    backgroundColor: "#ffffff", // Subtle background color
    paddingTop: "64px", // Adjust for navbar height
    overflowY: "auto", // Enable vertical scrolling
    display: "flex", // Flex layout for alignment
  }}
>
  {/* Navbar */}
  <AdminNavbar />
  <Sidebar />

  {/* Main Content */}
  <Box
    sx={{
      flex: 1, // Take up remaining space
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "1200px", // Limit the width
      margin: "0 auto", // Center the content
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
        marginBottom: "24px",
      }}
    >
      Available Categories
    </Typography>

    {/* Add Category Field */}
    {showTextField && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <TextField
          label="New Category"
          variant="outlined"
          value={newCategory}
          onChange={handleCategoryChange}
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
          onClick={() => handleAdd(newCategory)}
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

    {/* Table for Categories */}
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
              Category
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
            >
              Activities
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow
              key={category._id}
              sx={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // Alternate row colors
                "&:hover": {
                  backgroundColor: "#f1f1f1", // Highlight on hover
                },
              }}
            >
              <TableCell>
                {editingCategory && editingCategory.name === category.name ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={editedCategoryName}
                      onChange={handleEditCategoryChange}
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
                      color="primary"
                      onClick={() =>
                        handleEdit(category.name, editedCategoryName)
                      }
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
                  category.name
                )}
              </TableCell>
              <TableCell>{category.activities.join(", ")}</TableCell>
              <TableCell>
                <Tooltip title="Delete Category">
                  <IconButton
                    color="error"
                    aria-label="delete category"
                    onClick={() => handleClickOpen(category.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Category">
                  <IconButton
                    color="primary"
                    aria-label="edit category"
                    onClick={() => handleEditClick(category)}
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

    {/* Add New Category Button */}
    <Tooltip title="Add New Category">
      <IconButton
        color="success"
        aria-label="add category"
        onClick={handleAddCategoryClick}
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
          borderRadius: "12px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "#f44336",
        }}
      >
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this Category?
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
};

export default DeleteCategory;
