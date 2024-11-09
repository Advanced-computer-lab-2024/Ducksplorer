const express = require('express')
const { getUser } = require('../Controllers/userController');
const router = express.Router();

router.route("/:userName").get(getUser) //get certain user

module.exports = router;

//http://localhost:8000/user/:userName