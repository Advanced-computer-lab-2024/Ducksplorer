import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import AdminNavbar from "../../Components/NavBars/AdminNavBar";
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
import { useNavigate } from "react-router-dom";
import NavigationTabs from "../../Components/NavigationTabs";

const DeleteCategory = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tags");
  const [showTextField, setShowTextField] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const tabs = [
    "Tags",
    "Categories",
  ];

  const paths = ["/preferenceTags", "/categoriesActions"];


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
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
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
        height: "auto",
        paddingTop: "64px",
        width: "120vw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <div
        style={{ marginBottom: "40px", height: "100vh", paddingBottom: "10%" }}
      >
        <div style={{ overflowY: "visible", height: "auto" }}>
          <div>
            <NavigationTabs tabNames={tabs} paths={paths} />
          </div>
          <br></br>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom
          >
            Available Categories
          </Typography>
          <br></br>

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
                onClick={() => handleAdd(newCategory)}
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

          {/* Table for Categories */}
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
                <TableRow >
                  <TableCell
                    sx={{
                      fontWeight: "bold", fontSize: "16px", textAlign: "center", verticalAlign: "middle"
                    }}>
                    Category
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", textAlign: "center", verticalAlign: "middle" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow
                    key={category._id}
                  >
                    <TableCell style={{ textAlign: "center", verticalAlign: "middle" }}>
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
                    <TableCell style={{ textAlign: "center", verticalAlign: "middle" }}>
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

            {/* Add New Category Button */}
            <Box
              sx={{
                display: "flex", // Use flexbox
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                height: "8vh", // Optional: full viewport height for vertical centering
              }}
            >
              <Tooltip title="Add New Category">
                <IconButton
                  aria-label="add category"
                  onClick={handleAddCategoryClick}
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
          </TableContainer>
        </div>
      </div>
    </Box >

  );
};

export default DeleteCategory;
