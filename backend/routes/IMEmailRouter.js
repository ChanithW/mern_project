const express = require("express");
const router = express.Router();

//Insert model
const email = require("../model/IMEmailModel");
//Insert controller
const IMEmailController = require("../controller/IMEmailController");

router.get("/",IMEmailController.getEmail);
router.post("/",IMEmailController.addEmail);
router.get("/:id",IMEmailController.getById);
router.put("/:id",IMEmailController.updateEmail);
router.delete("/:id",IMEmailController.deleteEmail);

//export
module.exports = router;