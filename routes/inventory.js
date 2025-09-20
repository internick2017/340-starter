const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const utilities = require('../utilities');

// Route to get inventory by classification
router.get('/type/:classificationId', utilities.handleErrors(inventoryController.buildByClassificationId));

// Route to get vehicle detail by inventory id
router.get('/detail/:invId', utilities.handleErrors(inventoryController.buildDetailById));

// Intentional 500 error route for testing
router.get('/error-test', utilities.handleErrors((req, res, next) => {
  throw new Error('Intentional 500 error for testing.');
}));

module.exports = router;
