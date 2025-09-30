const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  
  // Get featured vehicles (first 3 vehicles from database)
  let featuredVehicles = []
  try {
    const data = await invModel.getFeaturedVehicles()
    featuredVehicles = data.rows.slice(0, 3) // Get first 3 vehicles
  } catch (error) {
    console.error('Error fetching featured vehicles:', error)
    // Fallback to empty array if database fails
  }
  
  res.render("index", {
    title: "Home", 
    nav, 
    featuredVehicles
  })
}

/* ***************************
 * Build inventory by classification view (WITH INTENTIONAL BUG)
 * ************************** */
baseController.buildByClassificationId = async function(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data.rows[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = baseController