const express = require("express");
const router = express.Router();

//Insert model
const tStock = require("../model/IMStoreModel");
//Insert controller
const IMStoreController = require("../controller/IMStoreController");

router.get("/",IMStoreController.getStore);
router.post("/",IMStoreController.addStore);
router.get("/:id",IMStoreController.getById);
router.put("/:id",IMStoreController.updateStore);
router.delete("/:id",IMStoreController.deleteStore);

//export
module.exports = router;