const express = require("express");
const router = express.Router();

const EMregisterCTRL = require("../controller/EMregisterCTRL");


router.get("/", EMregisterCTRL.getEM);// Get all employees
router.post("/", EMregisterCTRL.addEM);// Add new employee
router.get("/:id", EMregisterCTRL.getById);// Get single employee by MongoDB _id
router.put("/:id", EMregisterCTRL.updateEM);// Update employee by MongoDB _id
router.delete("/:id", EMregisterCTRL.deleteEM);// Delete employee by MongoDB _id

module.exports = router;
