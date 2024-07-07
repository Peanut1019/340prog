const {body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}
module.exports = invCont

invCont.buildbyDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getDetailById(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const invName = data[0].inv_model
  const invMake = data[0].inv_make
  res.render("./inventory/detail", {
    title: invName + ' ' + invMake,
    nav,
    grid,
    errors: null,
  })
}
module.exports = invCont
invCont.destroyServer = async function (req, res, next) {
  const inv_id = req.params.invId
  // const data = await invModel.getDetailById(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const invName = data[1]
  const invMake = data[0].inv_make
  res.render("./inventory/detail", {
    title: invName + ' ' + invMake,
    nav,
    grid,
    errors: null,
  })
}
async function buildManage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Manage",
    nav,
    errors: null,
  })
}
async function buildClass(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

module.exports = {buildClass, buildManage }
/* ****************************************
*  Process Classification
* *************************************** */
async function registerClass(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invtModel.getClassifications(
    classification_name
)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve made the classification: ${classification_name}.`
    )
    res.status(201).render("inventory/classification", {
      title: "Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification cannot be made.")
    res.status(501).render("inventory/classification", {
      title: "Classification",
      nav,
      errors: null,
    })
  }
}
module.exports = {registerClass}
invCont.addInventory = [
  body('inv_make').trim().isLength({ min: 1 }).withMessage('Make is required.'),
  body('inv_model').trim().isLength({ min: 1 }).withMessage('Model is required.'),
  body('inv_year').trim().isLength({ min: 4, max: 4 }).isNumeric().withMessage('Year must be a 4-digit number.'),
  body('inv_description').trim().isLength({ min: 1 }).withMessage('Description is required.'),
  body('inv_image').trim().isLength({ min: 1 }).withMessage('Image path is required.'),
  body('inv_thumbnail').trim().isLength({ min: 1 }).withMessage('Thumbnail path is required.'),
  body('inv_price').trim().isNumeric().withMessage('Price must be a number.'),
  body('inv_miles').trim().isNumeric().withMessage('Miles must be a number.'),
  body('inv_color').trim().isLength({ min: 1 }).withMessage('Color is required.'),
  body('classification_id').trim().isNumeric().withMessage('Classification is required.'),

  async (req, res, next) => {
    try {
      let nav = await Util.getNav();
      let classificationList = await Util.buildClassificationList(req.body.classification_id);
      if (!errors.isEmpty()) {
        return res.render("inventory/add-inventory", {
          title: "Add Inventory",
          nav,
          classificationList,
          messages: req.flash('notice'),
          errors: errors.array(),
          data: req.body
        });
      }
 
      const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
 
      const result = await invModel.addInventory({
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      });
      req.flash('notice', 'Inventory item added successfully.');
      res.redirect("/inv/management");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      req.flash('notice', 'Failed to add inventory item. Please try again.');
      res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        messages: req.flash('notice'),
        data: req.body
      });
    }
  }
];