const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    const data = await invModel.getClassifications()
    
    // Build navigation items array for better performance
    const navItems = ['<li><a href="/" title="Home page">Home</a></li>']
    
    data.rows.forEach((row) => {
      navItems.push(
        `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
      )
    })
    
    return `<ul>${navItems.join('')}</ul>`
  } catch (error) {
    console.error('Error building navigation:', error)
    // Return fallback navigation if database fails
    return '<ul><li><a href="/" title="Home page">Home</a></li></ul>'
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util