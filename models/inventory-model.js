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

module.exports = {getClassifications}