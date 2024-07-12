const utilities = require(".")
const {body, validatonResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")
/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
    body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Make is required."), // on error this message is sent.
  
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Model is required."), // on error this message is sent.
  
    body('inv_year')
        .trim()
        .isLength({ min: 4, max: 4 })
        .isNumeric()
        .withMessage('Year must be a 4-digit number.'),

    body('inv_description')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Description is required.'),
        
    body('inv_image')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Image path is required.'),
        
    body('inv_thumbnail')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Thumbnail path is required.'),
        
    body('inv_price')
        .trim()
        .isNumeric()
        .withMessage('Price must be a number.'),
        
    body('inv_miles')
        .trim()
        .isNumeric()
        .withMessage('Miles must be a number.'),
        
    body('inv_color')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Color is required.'),
        
    body('classification_id')
        .trim()
        .isNumeric()
        .withMessage('Classification is required.'),      
    ]
  }
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inv/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
      return
    }
    next()
  }
  validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inv/edit-inventory", {
        errors,
        title: "Edit Inventory",
        nav,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
      return
    }
    next()
  }
  
  module.exports = validate

