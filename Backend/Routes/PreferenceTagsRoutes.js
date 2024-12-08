const express = require("express");
const {createTags,deleteTags,updateTags,getTagsbyName,getAllTags } = require("../Controllers/PreferenceTagsController");

const router = express.Router();

router.get("/", getAllTags);//done

router.post("/", createTags);//done but not posted

router.put("/", updateTags);//done but not tested

router.delete("/", deleteTags);//done but not tested


module.exports = router;