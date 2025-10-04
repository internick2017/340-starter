const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const accountData = utilities.getAccountData(req)
  
  let featuredVehicles = []
  try {
    const data = await invModel.getFeaturedVehicles()
    featuredVehicles = data.rows.slice(0, 3)
  } catch (error) {
    console.error('Error fetching featured vehicles:', error)
  }
  
  res.render("index", {
    title: "Home", 
    nav, 
    featuredVehicles,
    accountData
  })
}


module.exports = baseController