const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    const query = {
      name: 'get-classifications',
      text: 'SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name'
    }
    return await pool.query(query)
  } catch (error) {
    console.error('Error getting classifications:', error)
    throw error
  }
}

/* ***************************
 *  Get all inventory items by classification (WITH INTENTIONAL BUG)
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    throw error
  }
}

/* ***************************
 *  Get vehicle detail by inventory id
 * ************************** */
async function getInventoryDetailById(invId) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `;
    const data = await pool.query(sql, [invId]);
    return data;
  } catch (error) {
    console.error("getInventoryDetailById error: " + error);
    throw error;
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error('Error adding classification:', error)
    throw error
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    console.error('Error adding inventory:', error)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryDetailById, addClassification, addInventory}