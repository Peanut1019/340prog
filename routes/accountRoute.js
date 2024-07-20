const express = require("express")
const router = new express.Router()
const utilities = require('../utilities/index')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')
router.get("/management", utilities.checkLogin, utilities.handleErrors(accountController.buildManage))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/registration", utilities.handleErrors(accountController.buildRegister))
router.get("/success", utilities.handleErrors(accountController.buildSuccess))
router.get("/update", utilities.handleErrors(accountController.buildUpdate))
router.get("/delete", utilities.handleErrors(accountController.buildDelete))

router.post(
  "/management",
  utilities.handleErrors(accountController.manageAccount)
)
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
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
  )
  router.post(
    "/update",
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount),
    utilities.handleErrors(accountController.updatePassword)
  )
  router.post(
    "/delete",
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.deleteAccount)
  )
module.exports = router;