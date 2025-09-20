const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

/* ***************************
 * Build inventory by classification view (WITH INTENTIONAL BUG)
 * ************************** */
baseController.buildByClassificationId = async function(req, res, next) {
  // INTENTIONAL BUG: Wrong parameter name (using params instead of req.params)
  const classification_id = params.classificationId
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