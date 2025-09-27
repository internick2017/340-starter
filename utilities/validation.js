const { body, validationResult } = require('express-validator')

/* ***************************
 * Validation Rules
 ************************** */

// Classification validation rules
const classificationValidationRules = [
  body('classification_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Classification name is required')
    .isLength({ max: 30 })
    .withMessage('Classification name must be 30 characters or less')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Classification name cannot contain spaces or special characters')
]

// Inventory validation rules
const inventoryValidationRules = [
  body('inv_make')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Make is required')
    .isLength({ max: 30 })
    .withMessage('Make must be 30 characters or less'),
  
  body('inv_model')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Model is required')
    .isLength({ max: 30 })
    .withMessage('Model must be 30 characters or less'),
  
  body('inv_year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid year between 1900 and ' + (new Date().getFullYear() + 1)),
  
  body('inv_description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  
  body('inv_image')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Image path is required')
    .isLength({ max: 50 })
    .withMessage('Image path must be 50 characters or less'),
  
  body('inv_thumbnail')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Thumbnail path is required')
    .isLength({ max: 50 })
    .withMessage('Thumbnail path must be 50 characters or less'),
  
  body('inv_price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('inv_miles')
    .isInt({ min: 0 })
    .withMessage('Miles must be a positive integer'),
  
  body('inv_color')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Color is required')
    .isLength({ max: 20 })
    .withMessage('Color must be 20 characters or less'),
  
  body('classification_id')
    .isInt({ min: 1 })
    .withMessage('Classification is required')
]

/* ***************************
 * Validation Middleware
 ************************** */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = res.locals.nav || []
    req.flash('notice', 'Please check the following errors:')
    req.flash('errors', errors.array())
    return res.render(req.originalUrl.includes('classification') ? 'inventory/add-classification' : 'inventory/add-inventory', {
      title: req.originalUrl.includes('classification') ? 'Add Classification' : 'Add Vehicle',
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id
    })
  }
  next()
}

module.exports = {
  classificationValidationRules,
  inventoryValidationRules,
  checkValidation
}
