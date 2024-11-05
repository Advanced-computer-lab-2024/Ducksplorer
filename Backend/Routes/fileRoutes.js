// const express = require('express');
// const multer = require('multer');
// const File = require('../Models/fileModel');
// const path = require('path');
// const fs = require('fs');

// const router = express.Router();

// // Setup storage using multer
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/'); // Files will be stored in the uploads folder
//     },
//     filename: function(req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// // Upload middleware
// const upload = multer({ storage: storage });

// // Upload file route
// router.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         const { originalname, mimetype, path, size } = req.file;
//         const file = new File({ originalname, mimetype, path, filename: req.file.filename, size });
//         await file.save();
//         res.status(201).json(file);
//     } catch (error) {
//         res.status(500).json({ error: 'File upload failed' });
//     }
// });

// // Get all uploaded files route
// router.get('/files', async (req, res) => {
//     try {
//         const files = await File.find({});
//         res.status(200).json(files);
//     } catch (error) {
//         res.status(500).json({ error: 'Unable to fetch files' });
//     }
// });

// // Download/view specific file
// router.get('/files/:id', async (req, res) => {
//     try {
//         const file = await File.findById(req.params.id);
//         if (!file) {
//             return res.status(404).json({ error: 'File not found' });
//         }
//         res.sendFile(path.resolve(file.path));
//     } catch (error) {
//         res.status(500).json({ error: 'Error retrieving file' });
//     }
// });

// module.exports = router;
