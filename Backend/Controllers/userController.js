const userModel = require("../Models/userModel");

const getUser = async (req, res) => {
    try {
        const { userName } = req.params;
        const user = await userModel.find({ userName: userName });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message, x: "oops" });
    }
};

module.exports = { getUser };