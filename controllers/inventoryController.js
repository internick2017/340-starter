
const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");

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
inventoryController.buildDetailById = async function(req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryDetailById(invId);
  let nav = await utilities.getNav();
  const detail = await utilities.buildDetailView(data.rows[0]);
  const title = `${data.rows[0].inv_year} ${data.rows[0].inv_make} ${data.rows[0].inv_model}`;
  res.render("./inventory/detail", {
    title,
    nav,
    detail,
  });
};

module.exports = inventoryController;
