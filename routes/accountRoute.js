const express = require("express")
const router = new express.Router()
const utilities = require('../utilities/index')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountLogin))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/registration", utilities.handleErrors(accountController.buildRegister))
router.get("/success", utilities.handleErrors(accountController.buildSuccess))
// Process the registration data
router.post(
    "/registration",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
  router.post(
    "/login",
      regValidate.loginRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.accountLogin)
  )
module.exports = router;