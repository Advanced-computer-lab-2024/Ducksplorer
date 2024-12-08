const express = require('express')
const { commentTourGuide } = require('../Controllers/tourGuideCommentController')
const router = express.Router();


router.route("/commentTourGuide/:tourGuideId").patch(commentTourGuide);//done

module.exports = router