const express = require("express");
const router = express.Router();

//Insert model
const drive = require("../model/ODMdriveModel");
//Insert controller
const ODMdriveController = require("../controller/ODMdriveController");

router.get("/",ODMdriveController.getdriver);
router.post("/",ODMdriveController.adddrive);
router.get("/:id",ODMdriveController.getById);
router.put("/:id",ODMdriveController.updatedrive);
router.delete("/:id",ODMdriveController.deletedrive);

//export
module.exports = router;