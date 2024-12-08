const express = require("express");
const {createTags,deleteTags,updateTags,getTagsbyName,getAllTags } = require("../../Controllers/Admin/PreferenceTags");

const router = express.Router();

router.get("/", getAllTags); //done

router.post("/", createTags); //done

router.put("/", updateTags); //done

router.delete("/", deleteTags);//done


module.exports = router;