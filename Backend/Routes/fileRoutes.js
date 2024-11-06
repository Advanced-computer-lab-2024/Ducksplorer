const express = require('express');
const File = require('../Models/fileModel');
const { uploadFiles, uploadProfilePicture, getUploadedFiles, getProfilePicture } = require('../Controllers/Upload/uploadController');
const upload = require('../Controllers/Upload/upload'); // Adjust the path if necessary
const router = express.Router();

// File upload route (multiple files for documents)
router.post("/user/upload/documents", upload.fields([{ name: 'files', maxCount: 4 }]), uploadFiles);

// Single file upload for profile picture
router.put("/user/upload/picture", upload.single('file'), uploadProfilePicture);

// Define the route to get user files
router.get('/user/files/:userName', getUploadedFiles);
router.get('/user/profile/picture/:userName', getProfilePicture);

module.exports = router;
