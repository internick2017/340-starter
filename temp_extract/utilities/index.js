const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
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

/* ****************************************
 * Build the classification view HTML (WITH INTENTIONAL BUG)
 **************************************** */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.rows.length > 0){
    grid = '<ul id="inv-display">'
    data.rows.forEach(vehicle => { 
      grid += '<li>'
      grid += '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Build the vehicle detail view HTML
 **************************************** */
Util.buildDetailView = function(vehicle) {
  if (!vehicle) return '<p class="notice">Vehicle not found.</p>';
  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Classification:</strong> ${vehicle.classification_name}</p>
      </div>
    </div>
  `;
};

/* ****************************************
 * Build the classification select list
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  } catch (error) {
    console.error('Error building classification list:', error)
    return '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>'
  }
}

/* ************************
 * Get account data from JWT token
 ************************** */
Util.getAccountData = function(req) {
  try {
    const token = req.cookies.jwt
    if (!token) return null
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'default-secret')
    return decoded
  } catch (error) {
    return null
  }
}

module.exports = Util