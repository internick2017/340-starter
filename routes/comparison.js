const express = require('express')
const router = express.Router()
const compController = require('../controllers/comparisonController')
const utilities = require('../utilities')

// Main comparison view
router.get('/', utilities.handleErrors(compController.buildComparisonView))

// Add vehicle to comparison
router.post('/add/:vehicleId', utilities.handleErrors(compController.addToComparison))

// Remove vehicle from comparison
router.post('/remove/:vehicleId', utilities.handleErrors(compController.removeFromComparison))

// Save comparison
router.post('/save', utilities.handleErrors(compController.saveComparison))

// View saved comparisons
router.get('/saved', utilities.handleErrors(compController.viewSavedComparisons))

// Load saved comparison
router.get('/load/:comparisonId', utilities.handleErrors(compController.loadComparison))

// Delete saved comparison
router.post('/delete/:comparisonId', utilities.handleErrors(compController.deleteComparison))

// Clear current comparison
router.post('/clear', utilities.handleErrors(compController.clearComparison))

module.exports = router