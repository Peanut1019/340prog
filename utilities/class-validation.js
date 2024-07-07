const utilities = require(".")
const {body, validatonResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")
/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.classRules = () => {
    return [
      // classification name  is required and must have no symbols
      body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("Classification does not meet requirements.")
        .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClass(classification_name)
            if (classExists){
              throw new Error("Classification exists. Please enter in a new classification")
            }
        }),
    ]
  }
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
  module.exports = validate