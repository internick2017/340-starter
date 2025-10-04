const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const utilities = require('../utilities');
const { classificationValidationRules, inventoryValidationRules, checkValidation } = require('../utilities/validation');

// Route to get inventory by classification
router.get('/type/:classificationId', utilities.handleErrors(inventoryController.buildByClassificationId));

// Route to get vehicle detail by inventory id
router.get('/detail/:invId', utilities.handleErrors(inventoryController.buildDetailById));

// Management route
router.get('/', utilities.handleErrors(inventoryController.buildManagement));

// Add classification routes
router.get('/add-classification', utilities.handleErrors(inventoryController.buildAddClassification));
router.post('/add-classification', classificationValidationRules, checkValidation, utilities.handleErrors(inventoryController.addClassification));

// Add inventory routes
router.get('/add-inventory', utilities.handleErrors(inventoryController.buildAddInventory));
router.post('/add-inventory', inventoryValidationRules, checkValidation, utilities.handleErrors(inventoryController.addInventory));

// Delete inventory routes
router.get('/delete/:inv_id', utilities.handleErrors(inventoryController.buildDeleteConfirmation));
router.post('/delete/:inv_id', utilities.handleErrors(inventoryController.deleteInventory));

// Intentional 500 error route for testing
router.get('/error-test', utilities.handleErrors((req, res, next) => {
  throw new Error('Intentional 500 error for testing.');
}));

module.exports = router;
