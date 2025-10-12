const utilities = require("../utilities/")
const compModel = require("../models/comparison-model")
const invModel = require("../models/inventory-model")

const compController = {}

/* ****************************************
*  Build comparison view
**************************************** */
compController.buildComparisonView = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const sessionId = req.sessionID
    const accountId = res.locals.accountData ? res.locals.accountData.account_id : null
    
    let vehicleIds = req.session.compareVehicles || []
    
    if (req.query.vehicles) {
      vehicleIds = req.query.vehicles.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      req.session.compareVehicles = vehicleIds
    }
    
    if (vehicleIds.length > 4) {
      req.flash("notice", "You can compare maximum 4 vehicles at once.")
      vehicleIds = vehicleIds.slice(0, 4)
      req.session.compareVehicles = vehicleIds
    }
    
    let vehicles = []
    if (vehicleIds.length > 0) {
      const data = await compModel.getVehiclesForComparison(vehicleIds)
      vehicles = data.rows
    }
    
    res.render("./comparison/compare", {
      title: "Compare Vehicles",
      nav,
      vehicles,
      vehicleIds,
      errors: null,
      messages: req.flash()
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Add vehicle to comparison
**************************************** */
compController.addToComparison = async function(req, res, next) {
  try {
    const vehicleId = parseInt(req.params.vehicleId)
    
    if (!vehicleId || isNaN(vehicleId)) {
      req.flash("error", "Invalid vehicle ID.")
      return res.redirect(req.get("Referrer") || "/")
    }
    
    const vehicleData = await invModel.getInventoryDetailById(vehicleId)
    if (!vehicleData.rows.length) {
      req.flash("error", "Vehicle not found.")
      return res.redirect(req.get("Referrer") || "/")
    }
    
    if (!req.session.compareVehicles) {
      req.session.compareVehicles = []
    }
    
    if (req.session.compareVehicles.includes(vehicleId)) {
      req.flash("notice", "Vehicle is already in your comparison.")
      return res.redirect(req.get("Referrer") || "/")
    }
    
    if (req.session.compareVehicles.length >= 4) {
      req.flash("error", "You can compare maximum 4 vehicles. Remove one to add another.")
      return res.redirect("/comparison")
    }
    
    req.session.compareVehicles.push(vehicleId)
    const vehicle = vehicleData.rows[0]
    req.flash("success", `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} added to comparison.`)
    
    req.session.save((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/comparison")
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Remove vehicle from comparison
**************************************** */
compController.removeFromComparison = async function(req, res, next) {
  try {
    const vehicleId = parseInt(req.params.vehicleId)
    
    if (!req.session.compareVehicles) {
      req.session.compareVehicles = []
    }
    
    const index = req.session.compareVehicles.indexOf(vehicleId)
    if (index > -1) {
      req.session.compareVehicles.splice(index, 1)
      req.flash("success", "Vehicle removed from comparison.")
    } else {
      req.flash("notice", "Vehicle was not in comparison.")
    }
    
    res.redirect("/comparison")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Save comparison
**************************************** */
compController.saveComparison = async function(req, res, next) {
  try {
    const { comparisonName } = req.body
    const sessionId = req.sessionID
    const accountId = res.locals.accountData ? res.locals.accountData.account_id : null
    const vehicleIds = req.session.compareVehicles || []
    
    // Validation
    let errors = []
    
    if (!comparisonName || comparisonName.trim().length === 0) {
      errors.push("Comparison name is required.")
    }
    
    if (comparisonName && comparisonName.length > 100) {
      errors.push("Comparison name must be 100 characters or less.")
    }
    
    if (vehicleIds.length < 2) {
      errors.push("You must have at least 2 vehicles to save a comparison.")
    }
    
    if (vehicleIds.length > 4) {
      errors.push("You can compare maximum 4 vehicles.")
    }
    
    // Validate comparison name format
    if (comparisonName && !/^[a-zA-Z0-9\s\-_]+$/.test(comparisonName)) {
      errors.push("Comparison name can only contain letters, numbers, spaces, hyphens, and underscores.")
    }
    
    if (errors.length > 0) {
      let nav = await utilities.getNav()
      const data = await compModel.getVehiclesForComparison(vehicleIds)
      const vehicles = data.rows
      
      return res.render("./comparison/compare", {
        title: "Compare Vehicles",
        nav,
        vehicles,
        vehicleIds,
        comparisonName,
        errors,
        messages: req.flash()
      })
    }
    
    // Save comparison
    await compModel.saveComparison(sessionId, vehicleIds, comparisonName.trim(), accountId)
    
    // Clear current comparison after saving
    req.session.compareVehicles = []
    
    req.flash("success", "Comparison saved successfully!")
    res.redirect("/comparison/saved")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  View saved comparisons
**************************************** */
compController.viewSavedComparisons = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const sessionId = req.sessionID
    const accountId = res.locals.accountData ? res.locals.accountData.account_id : null
    
    const data = await compModel.getSavedComparisons(sessionId, accountId)
    const comparisons = data.rows
    
    res.render("./comparison/saved", {
      title: "Saved Comparisons",
      nav,
      comparisons,
      errors: null,
      messages: req.flash()
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Delete saved comparison
**************************************** */
compController.deleteComparison = async function(req, res, next) {
  try {
    const comparisonId = parseInt(req.params.comparisonId)
    const sessionId = req.sessionID
    const accountId = res.locals.accountData ? res.locals.accountData.account_id : null
    
    if (!comparisonId || isNaN(comparisonId)) {
      req.flash("error", "Invalid comparison ID.")
      return res.redirect("/comparison/saved")
    }
    
    const result = await compModel.deleteComparison(comparisonId, sessionId, accountId)
    
    if (result.rowCount > 0) {
      req.flash("success", "Comparison deleted successfully.")
    } else {
      req.flash("error", "Comparison not found or you don't have permission to delete it.")
    }
    
    res.redirect("/comparison/saved")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Load saved comparison
**************************************** */
compController.loadComparison = async function(req, res, next) {
  try {
    const comparisonId = parseInt(req.params.comparisonId)
    const sessionId = req.sessionID
    const accountId = res.locals.accountData ? res.locals.accountData.account_id : null
    
    if (!comparisonId || isNaN(comparisonId)) {
      req.flash("error", "Invalid comparison ID.")
      return res.redirect("/comparison/saved")
    }
    
    const data = await compModel.getComparisonById(comparisonId, sessionId, accountId)
    
    if (data.rows.length === 0) {
      req.flash("error", "Comparison not found.")
      return res.redirect("/comparison/saved")
    }
    
    const comparison = data.rows[0]
    req.session.compareVehicles = comparison.vehicle_ids
    
    req.flash("success", `Loaded comparison: ${comparison.comparison_name}`)
    res.redirect("/comparison")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Clear current comparison
**************************************** */
compController.clearComparison = async function(req, res, next) {
  try {
    req.session.compareVehicles = []
    req.flash("success", "Comparison cleared.")
    res.redirect("/comparison")
  } catch (error) {
    next(error)
  }
}

module.exports = compController