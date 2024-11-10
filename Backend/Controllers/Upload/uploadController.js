// Import necessary models
const User = require("../../Models/userModel.js");
const Advertiser = require("../../Models/advertiserModel.js");
const Seller = require("../../Models/sellerModel.js");
const TourGuide = require("../../Models/tourGuideModel.js");
const { upload } = require("../Upload/upload.js"); // Adjust path based on your structure
const fs = require("fs");
const path = require("path");
const Tourist = require("../../Models/touristModel.js");

// Define uploads directory
const uploadsDir = path.join(__dirname, '../../uploads');

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
      if (!filePath) {
          console.error('No file path provided for deletion.');
          return reject(new Error('No file path provided.'));
      }

      fs.unlink(filePath, (err) => {
          if (err) {
              console.error(`Error deleting file at ${filePath}:`, err.message);
              return reject(err);
          }
          console.log(`File deleted successfully at ${filePath}`);
          resolve();
      });
  });
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userName = req.body.userName;  // Change userId to userName
    console.log(req.body);

    if (!userName) {
      return res.status(400).json({ message: "User name is required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const file = req.file;

    // Find the user by userName
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userType = user.role;
    let userModel;

    // Determine the user model based on user type
    if (userType === "Seller") {
      userModel = Seller;
    } else if (userType === "Advertiser") {
      userModel = Advertiser;
    } else if (userType === "Guide") {
      userModel = TourGuide;
    } else if (userType === "Tourist") {
      userModel = Tourist;
    } else {
      return res.status(400).json({ message: "Unsupported user type." });
    }

    // Handle existing profile picture removal
    const existingUser = await userModel.findOne({ userName }).select("profilePicture").exec();  // Query by userName
    const existingProfilePicture = existingUser?.profilePicture;

    if (existingProfilePicture && existingProfilePicture.filepath) {
      const exists = fs.existsSync(existingProfilePicture.filepath);
      if (exists) {
        await deleteFile(existingProfilePicture.filepath);
      }
    }

    // New profile picture data
    const profilePictureData = {
      filename: file.originalname,
      filepath: path.resolve(file.path),
      uploadedAt: new Date().toISOString(),
    };

    // Update user's profile with the new profile picture data
    await userModel.findOneAndUpdate({ userName }, { profilePicture: profilePictureData }, { new: true, useFindAndModify: false });

    res.status(200).json({
      message: "Profile picture uploaded successfully!",
      profilePicture: profilePictureData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading profile picture", error: err.message });
  }
};


exports.uploadFiles = async (req, res) => {
  try {
      const userName = req.headers["user-name"] || req.body.userName;  // Change to use userName
      if (!userName) {
          return res.status(400).json({ message: "User name is required." });
      }

      // Access files array based on multer.fields setup
      const filesArray = req.files['files'];
      if (!filesArray || filesArray.length === 0) {  // Check if any files are uploaded
          return res.status(400).json({ message: "No files uploaded." });
      }

      const user = await User.findOne({ userName });  // Change from findById to findOne for userName
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      const userType = user.role;

      const uploadedFiles = [];
      const fileNames = filesArray.map((file) => file.originalname);
      const duplicateFileNames = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);

      if (duplicateFileNames.length > 0) {
          return res.status(400).json({ message: `Duplicate file names detected: ${duplicateFileNames.join(", ")}` });
      }

      let existingFiles = [];
      if (userType === "Seller") {
          existingFiles = await Seller.findOne({ userName }).select("files.filename").exec();  // Change from findById to findOne
      } else if (userType === "Advertiser") {
          existingFiles = await Advertiser.findOne({ userName }).select("files.filename").exec();  // Change from findById to findOne
      } else if (userType === "Tour Guide") {
          existingFiles = await TourGuide.findOne({ userName }).select("files.filename").exec();  // Change from findById to findOne
      }

      // Add check for existingFiles.files before using map
      const existingFileNames = existingFiles?.files ? existingFiles.files.map((file) => file.filename) : [];
      const collidingFileNames = fileNames.filter((name) => existingFileNames.includes(name));

      if (collidingFileNames.length > 0) {
          return res.status(400).json({ message: `Files with these names already exist: ${collidingFileNames.join(", ")}` });
      }

      for (const file of filesArray) { // Loop through filesArray directly
          const fileData = {
              filename: file.originalname,
              filepath: path.resolve(file.path),
              uploadedAt: new Date().toISOString(),
          };

          if (userType === "Seller") {
              await Seller.findOneAndUpdate({ userName }, { $push: { files: fileData } }, { new: true, useFindAndModify: false });  // Change from findById to findOneAndUpdate
          } else if (userType === "Advertiser") {
              await Advertiser.findOneAndUpdate({ userName }, { $push: { files: fileData } }, { new: true, useFindAndModify: false });  // Change from findById to findOneAndUpdate
          } else if (userType === "Guide") {
              await TourGuide.findOneAndUpdate({ userName }, { $push: { files: fileData } }, { new: true, useFindAndModify: false });  // Change from findById to findOneAndUpdate
          }

          uploadedFiles.push(fileData);
      }

      res.status(200).json({
          message: "Files uploaded successfully!",
          files: uploadedFiles,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error uploading files", error: err.message });
  }
};





exports.getUploadedFiles = async (req, res) => {
  try {
      const { userName } = req.params;  // Change userId to userName

      const user = await User.findOne({ userName });  // Find the user by userName
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      let files = [];
      if (user.role === "Seller") {
          const seller = await Seller.findOne({ userName }).select("files");  // Find Seller by userName
          files = seller ? seller.files : [];
      } else if (user.role === "Advertiser") {
          const advertiser = await Advertiser.findOne({ userName }).select("files");  // Find Advertiser by userName
          files = advertiser ? advertiser.files : [];
      } else if (user.role === "Guide") {
          const tourGuide = await TourGuide.findOne({ userName }).select("files");  // Find TourGuide by userName
          files = tourGuide ? tourGuide.files : [];
      }

      if (files.length === 0) {
          return res.status(404).json({ message: "No files found for this user." });
      }

      const fileUrls = files.map((file) => ({
          filename: file.filename,
          url: `${req.protocol}://${req.get("host")}/uploads/${userName}/${file.filename}`,  // Use userName in URL
      }));

      res.status(200).json(fileUrls);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching files", error: err.message });
  }
};


exports.getProfilePicture = async (req, res) => {
  try {
      const { userName } = req.params;  // Change userId to userName

      const user = await User.findOne({ userName });  // Find the user by userName
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      let profilePicture = null;

      if (user.role === "Seller") {
          const seller = await Seller.findOne({ userName }).select("profilePicture");  // Find Seller by userName
          profilePicture = seller ? seller.profilePicture : null;
      } else if (user.role === "Advertiser") {
          const advertiser = await Advertiser.findOne({ userName }).select("profilePicture");  // Find Advertiser by userName
          profilePicture = advertiser ? advertiser.profilePicture : null;
      } else if (user.role === "Tourist") {
          const tourist = await Tourist.findOne({ userName }).select("profilePicture");  // Find Tourist by userName
          profilePicture = tourist ? tourist.profilePicture : null;
      } else if (user.role === "Guide") {
          const tourGuide = await TourGuide.findOne({ userName }).select("profilePicture");  // Find TourGuide by userName
          profilePicture = tourGuide ? tourGuide.profilePicture : null;
      }

      if (!profilePicture || !profilePicture.filepath) {
          return res.status(404).json({ message: "No profile picture found for this user." });
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${userName}/${profilePicture.filename}`;  // Use userName in URL
      res.status(200).json({ url: fileUrl });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching profile picture", error: err.message });
  }
};

