const express = require("express");
const {createTags,deleteTags,updateTags,getTagsbyName,getAllTags } = require("../../Controllers/Admin/PreferenceTags");

const router = express.Router();

router.get("/", getAllTags);

router.post("/", createTags);

router.put("/", updateTags);

router.delete("/", deleteTags);


module.exports = router;