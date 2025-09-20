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
      // INTENTIONAL BUG: Missing comma in SELECT statement
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1"
      [classification_id]
    )
    return data
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId}