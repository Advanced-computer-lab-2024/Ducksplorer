const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the base uploads directory
const uploadsDir = path.join(__dirname, "..","..","..", "uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Access userName from headers with a fallback for req.body
    const userName = req.headers["user-name"] || req.body.userName;
    if (!userName) {
      return cb(new Error("User name is not provided"), null);
    }

    // Create a directory for the user's uploads
    const userUploadDir = path.join(uploadsDir, userName);  // Use userName instead of userId
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    cb(null, userUploadDir); // Set the destination to the user's upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for uploads
  },
});

// Export the multer configuration without specifying array or fields
const upload = multer({ storage });
module.exports = upload;
