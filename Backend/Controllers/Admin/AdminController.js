const User = require('../../Models/userModel.js');
const Tourist = require('../../Models/touristModel.js');
const Tourguide = require('../../Models/tourGuideModel.js');
const Seller = require('../../Models/sellerModel.js');
const Advertiser = require('../../Models/advertiserModel.js');


const deleteUser = async (req, res) => {
  const {userName} = req.body;

  try {
    const user = await User.findOne({userName});

    if (!user) {
      return res.status(404).json({ message: 'User not found in table users' });
    }

    const role = user.role;

    // Remove the user from the users collection
    await User.deleteOne({userName});

    // Delete the user from the specific role collection
    switch (role) {
      case 'Tourist':
        await Tourist.deleteOne({ userName });
        break;
      case 'Tourguide':
        await Tourguide.deleteOne({ userName});
        break;
      case 'Seller':
        await Seller.deleteOne({ userName });
        break;
      case 'Advertiser':
        await Advertiser.deleteOne({ userName });
        break;

      default:
        return res.status(400).json({ message: `User is ${role}` });
    }

    return res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const addUser = async (req, res) => {
  const { userName, password, role } = req.body;

  try {
    const user = await User.findOne({userName});
    if(user)
       {
          return res.status(400).json({error:"Username Already Exists"});
       }
    const newuser = new User({ role, userName, password });

    // Save the user to the database
    await newuser.save();

    return res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const approveUser = async (req, res) => {
  const { userName } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.status = 'Approved';
    await user.save();
    return res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getPendingUsers = async (req, res) => {
try {
  const users = await User.find({ status: 'Pending' });
  return res.status(200).json({ users });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ status: { $ne: 'Pending' } });
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    deleteUser,
    addUser,
    approveUser,
    getPendingUsers,
    getUsers
};
