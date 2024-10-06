import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import {TextField, IconButton,Box, Button, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle ,Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../../Components/Sidebar.js';


const PreferenceTags = () => {
  const [tags, setTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTag, setselectedTag] = useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [editedTagName, setEditedTagName] = useState('');


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
    axios.get('http://localhost:8000/preferenceTags')
      .then(response => {
        setTags(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tags!', error);
      });
  }, []);

const handleDelete = (Name) => {
    fetch('http://localhost:8000/preferenceTags', {
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
            message.success('tag deleted successfully!');
            setTags(tags.filter(tag => tag.name !== Name));
        })
        .catch(error => {
            console.log(tags);
            message.error('There was an error deleting the tag!');
            console.error('There was an error deleting the tag!', error);
        });
};

const handleEdit = (oldName,Name) => {
    axios.put('http://localhost:8000/preferenceTags', { currentName: oldName ,  newName: Name  })
        .then(response => {
          setTags(tags.map(tag => 
            tag.name === editingTag.name ? { ...tag, name: editedTagName } : tag
          ));
            setEditingTag(null);
            setEditedTagName('');
            message.success('tag updated successfully!');
        })
        .catch(error => {
            message.error('There was an error updating the tag!');
            console.error('There was an error updating the tag!', error);
        });
};

const handleAdd = (Name) => {
    axios.post('http://localhost:8000/preferenceTags', { name: Name })
        .then(response => {
            setTags([...tags, response.data]);
            message.success('tag added successfully!');
            setShowTextField(false);
            setNewTag('');
        })
        .catch(error => {
            message.error('There was an error adding the tag!');
            console.error('There was an error adding the tag!', error);
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
    <>
    <Sidebar/>
    <Box sx={{ p: 6 , maxWidth: 1200}}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4">
          Available tags
        </Typography>
      </Box>
      {showTextField && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <TextField
            label="New tag"
            variant="outlined"
            value={newTag}
            onChange={handletagChange}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary"onClick={() => handleAdd(newTag)}>
            Add
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>tag</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map(tag => (
              <TableRow key={tag._id}>
                <TableCell>
                  {editingTag && editingTag.name === tag.name ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        value={editedTagName}
                        onChange={handleEdittagChange}
                        autoFocus
                        sx={{ mr: 2 }}
                      />
                      <Button variant="contained" color="success" onClick={() => handleEdit(tag.name,editedTagName)}>
                        Confirm
                      </Button>
                    </Box>
                  ) : (
                    tag.name
                  )}
                </TableCell>
                <TableCell>
                <Tooltip title="Delete tag">
                    <IconButton color="error" aria-label="delete tag" onClick={() => handleClickOpen(tag.name)}>
                      <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit tag">
                    <IconButton color="primary" aria-label="edit tag" onClick={() => handleEditClick(tag)}>
                      <EditIcon />
                    </IconButton>
                </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Tooltip title="Add New tag">
          <IconButton color="success" aria-label="add tag" onClick={handleAddtagClick}>
            <AddIcon />
          </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tag?
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

export default PreferenceTags;