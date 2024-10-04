import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import {TextField, IconButton,Box, Button, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle ,Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../../Components/Sidebar.js';


const DeleteCategory = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setselectedCategory] = useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');


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
    axios.get('http://localhost:8000/act')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

const handleDelete = (id) => {
    fetch(`http://localhost:8000/activity/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: Name }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            message.success('Activity deleted successfully!');
            setCategories(categories.filter(category => category.name !== Name));
        })
        .catch(error => {
            console.log(categories);
            message.error('There was an error deleting the category!');
            console.error('There was an error deleting the category!', error);
        });
};

const handleEdit = (oldName,Name) => {
    axios.put('http://localhost:8000/adminActivity', { currentName: oldName ,  newName: Name  })
        .then(response => {
          setCategories(categories.map(category => 
            category.name === editingCategory.name ? { ...category, name: editedCategoryName } : category
          ));
            setEditingCategory(null);
            setEditedCategoryName('');
            message.success('Category updated successfully!');
        })
        .catch(error => {
            message.error('There was an error updating the category!');
            console.error('There was an error updating the category!', error);
        });
};

const handleAdd = (Name) => {
    axios.post('http://localhost:8000/adminActivity', { name: Name })
        .then(response => {
            setCategories([...categories, response.data]);
            message.success('Category added successfully!');
            setShowTextField(false);
            setNewCategory('');
        })
        .catch(error => {
            message.error('There was an error adding the category!');
            console.error('There was an error adding the category!', error);
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
    <>
    <Sidebar/>
    <Box sx={{ p: 6 , maxWidth: 1200}}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4">
          Available Categories
        </Typography>
      </Box>
      {showTextField && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <TextField
            label="New Category"
            variant="outlined"
            value={newCategory}
            onChange={handleCategoryChange}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary"onClick={() => handleAdd(newCategory)}>
            Add
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Activities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category._id}>
                <TableCell>
                  {editingCategory && editingCategory.name === category.name ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        value={editedCategoryName}
                        onChange={handleEditCategoryChange}
                        autoFocus
                        sx={{ mr: 2 }}
                      />
                      <Button variant="contained" color="primary" onClick={() => handleEdit(category.name,editedCategoryName)}>
                        Confirm
                      </Button>
                    </Box>
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>{category.activities.join(', ')}</TableCell>
                <TableCell>
                <Tooltip title="Delete Category">
                    <IconButton color="error" aria-label="delete category" onClick={() => handleClickOpen(category.name)}>
                      <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Category">
                    <IconButton color="primary" aria-label="edit category" onClick={() => handleEditClick(category)}>
                      <EditIcon />
                    </IconButton>
                </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Tooltip title="Add New Category">
          <IconButton color="success" aria-label="add category" onClick={handleAddCategoryClick}>
            <AddIcon />
          </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Category?
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

export default DeleteCategory;