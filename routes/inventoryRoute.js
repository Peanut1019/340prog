// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities/index')
const invController = require("../controllers/invController")
const regValidate = require('../utilities/class-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildbyDetail));
// router.get ("/detail/:invId", utilities.handleErrors(invController.destroyServer));
router.get("/management", utilities.handleErrors(invController.buildManage));
router.get("/add-classification", utilities.handleErrors(invController.buildClass));
router.get("/add-classification", utilities.handleErrors(invController.registerClass));
router.get("/add-inventory", utilities.handleErrors(invController.addInventory));
router.post(
    "/add-classification",
    regValidate.classRules(),
    regValidate.checkClassData,
    utilities.handleErrors(invController.registerClass)
  )
  router.post(
    "/add-inventory",
    utilities.handleErrors(invController.addInventory)
  )
module.exports = router;