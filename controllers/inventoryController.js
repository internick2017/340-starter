
const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");
const { classificationValidationRules, inventoryValidationRules, checkValidation } = require("../utilities/validation");

const inventoryController = {};

// Existing classification view
inventoryController.buildByClassificationId = async function(req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data.rows[0]?.classification_name || "Inventory";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// Vehicle detail view
inventoryController.buildDetailById = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const data = await invModel.getInventoryDetailById(invId)
    
    if (!data.rows.length) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/")
    }
    
    const detail = await utilities.buildDetailView(data.rows[0])
    let nav = await utilities.getNav()
    const vehicle = data.rows[0]
    const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      detail,
    })
  } catch (error) {
    next(error)
  }
}

// Management view
inventoryController.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav();
  const data = await invModel.getAllInventory();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    data,
    messages: req.flash()
  });
};

// Add classification view
inventoryController.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    messages: req.flash()
  });
};

// Add inventory view
inventoryController.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    messages: req.flash()
  });
};

// Process add classification
inventoryController.addClassification = async function(req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  
  try {
    const result = await invModel.addClassification(classification_name);
    if (result && result.rows && result.rows.length > 0) {
      req.flash('notice', `The ${classification_name} classification was successfully added.`);
      res.redirect("/inv/");
    } else {
      throw new Error('No data returned from database');
    }
  } catch (error) {
    console.error('Error adding classification:', error);
    req.flash('notice', `Sorry, there was an error adding the classification: ${error.message}`);
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name,
      messages: req.flash()
    });
  }
};

// Process add inventory
inventoryController.addInventory = async function(req, res, next) {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  
  try {
    const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    if (result && result.rows && result.rows.length > 0) {
      const newVehicle = result.rows[0];
      req.flash('notice', `The ${inv_year} ${inv_make} ${inv_model} was successfully added with ID: ${newVehicle.inv_id}.`);
      res.redirect("/inv/");
    } else {
      throw new Error('No data returned from database');
    }
  } catch (error) {
    console.error('Error adding inventory:', error);
    req.flash('notice', `Sorry, there was an error adding the vehicle: ${error.message}`);
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      messages: req.flash()
    });
  }
};

// Delete confirmation view
inventoryController.buildDeleteConfirmation = async function(req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryDetailById(inv_id);
  let nav = await utilities.getNav();
  const vehicle = data.rows[0];
  const title = `Delete ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
  res.render("./inventory/delete-confirmation", {
    title,
    nav,
    vehicle,
    messages: req.flash()
  });
};

// Process delete inventory
inventoryController.deleteInventory = async function(req, res, next) {
  const inv_id = req.params.inv_id;
  
  try {
    const result = await invModel.deleteInventory(inv_id);
    if (result && result.rows && result.rows.length > 0) {
      const deletedVehicle = result.rows[0];
      req.flash('notice', `The ${deletedVehicle.inv_year} ${deletedVehicle.inv_make} ${deletedVehicle.inv_model} was successfully deleted.`);
      res.redirect("/inv/");
    } else {
      throw new Error('No data returned from database');
    }
  } catch (error) {
    console.error('Error deleting inventory:', error);
    req.flash('notice', `Sorry, there was an error deleting the vehicle: ${error.message}`);
    res.redirect("/inv/");
  }
};

module.exports = inventoryController;
