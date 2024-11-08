// /controllers/documentController.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Configure Cloudinary directly in the controller
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    let resourceType = 'raw'; // Default to 'raw' for non-images
    if (file.mimetype.startsWith('image')) {
      resourceType = 'image'; // For image files, use 'image'
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType }, // 'raw' type is for non-image files like PDFs
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer); // Stream the file buffer
    });
    res.status(200).json({
        url: result.secure_url,
    });
    
    return result.secure_url;

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

  
module.exports = { uploadDocument };
