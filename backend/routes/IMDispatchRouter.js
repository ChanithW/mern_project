const express = require("express");
const router = express.Router();

//Insert model
const tStock = require("../model/IMDispatchModel");
//Insert controller
const IMDispatchController = require("../controller/IMDispatchController");

router.get("/",IMDispatchController.getDispatch);
router.post("/",IMDispatchController.addDispatch);
router.get("/:id",IMDispatchController.getById);
router.put("/:id",IMDispatchController.updateDispatch);
router.delete("/:id",IMDispatchController.deleteDispatch);

//export
module.exports = router;