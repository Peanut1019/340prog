const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
module.exports = {getClassifications, getInventoryByClassificationId};

async function getMakes(){
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_make")
}
module.exports = {getClassifications, getInventoryByClassificationId, getMakes}

async function getModels(){
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_model")
}
module.exports = {getClassifications, getInventoryByClassificationId, getMakes, getModels}

async function getDetailById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.inventory AS c 
      ON i.inv_id = c.inv_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getdetailbymodel error " + error)
  }
}
async function checkExistingClass(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classi = await pool.query(sql, [classification_name])
    return classi.rowCount
  }
  catch(error) {
    return error.message
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getMakes, getModels, getDetailById, checkExistingClass};

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getMakes, getModels, getDetailById, checkExistingClass, addInventory};