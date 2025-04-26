const express = require("express");
const router = express.Router();

//insert model
const employee = require("../model/EMregistermodel");
//insert ctrl
const EMregisterCTRL = require("../controller/EMregisterCTRL");

router.get("/",EMregisterCTRL.getEM);
router.post("/",EMregisterCTRL.addEM);
router.get("/:id",EMregisterCTRL.getById);
router.put("/:id",EMregisterCTRL.updateEM);
router.delete("/:id",EMregisterCTRL.deleteEM);


//export
module.exports = router;