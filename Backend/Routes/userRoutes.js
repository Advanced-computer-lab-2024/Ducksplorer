const express = require('express')
const { getUser } = require('../Controllers/userController');
const router = express.Router();

router.route("/:userName").get(getUser) //done

module.exports = router;

//http://localhost:8000/user/:userName