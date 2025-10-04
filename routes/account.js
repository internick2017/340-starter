const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const auth = require('../utilities/auth')
const { body } = require('express-validator')

const accountValidationRules = [
  body('firstname').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastname').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

const accountUpdateRules = [
  body('firstname').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastname').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required')
]

const passwordUpdateRules = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

function checkValidation(req, res, next) {
  const errors = []
  if (req.body.firstname && req.body.firstname.trim().length === 0) {
    errors.push({ msg: 'First name is required' })
  }
  if (req.body.lastname && req.body.lastname.trim().length === 0) {
    errors.push({ msg: 'Last name is required' })
  }
  if (req.body.email && !req.body.email.includes('@')) {
    errors.push({ msg: 'Valid email is required' })
  }
  if (req.body.password && req.body.password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }
  
  if (errors.length > 0) {
    req.flash('errors', errors)
    return res.redirect('back')
  }
  next()
}

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.post('/login', utilities.handleErrors(accountController.processLogin))

router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.post('/register', accountValidationRules, checkValidation, utilities.handleErrors(accountController.processRegister))

router.get('/', auth.verifyToken, utilities.handleErrors(accountController.buildAccountManagement))
router.post('/update-account', auth.verifyToken, accountUpdateRules, checkValidation, utilities.handleErrors(accountController.processAccountUpdate))
router.post('/update-password', auth.verifyToken, passwordUpdateRules, checkValidation, utilities.handleErrors(accountController.processPasswordUpdate))

router.get('/logout', utilities.handleErrors(accountController.processLogout))

module.exports = router
