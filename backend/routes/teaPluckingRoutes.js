const express = require("express");
const router = express.Router();
const teaPluckingController = require("../controller/teaPluckingController");
const records = require("../model/TeaPluckingModel")


router.get("/", teaPluckingController.getAllRecords); // get all tea plucking rec

//Get by id
//router.get("/:id", teaPluckingController.getById);


router.get("/date/:date", teaPluckingController.getRecordsByDate);// get rec by date

// get emp for dropdown
router.get("/employees", teaPluckingController.getEmployeesForDropdown);
router.get("/employees/nonP", teaPluckingController.getNonPermanentEmployees);


router.post("/", teaPluckingController.addRecord);// add new rec


router.put("/:id", teaPluckingController.updateRecord);// update rec


router.delete("/:id", teaPluckingController.deleteRecord); // delete reco


router.get("/employee/:employeeId", teaPluckingController.getRecordsByEmployeeId); //get rec by empid

//get rec by recid to display in the edit form
router.get("/record/:id", teaPluckingController.getRecordById);


module.exports = router;