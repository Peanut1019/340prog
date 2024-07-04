const invModel = require("../models/inventory-model")
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
module.exports = invCont