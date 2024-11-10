// /routes/documentRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadDocument } = require('../Controllers/documentController');

const router = express.Router();

// Set up multer directly in the routes file
const storage = multer.memoryStorage(); // Store files in memory
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
//   }
// };

const upload = multer({
  storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Define the route with multer middleware
router.post('/upload', upload.single('file'), uploadDocument);

module.exports = router;
