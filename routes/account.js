const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const auth = require('../utilities/auth')
const accountModel = require('../models/account-model')
const { body, validationResult } = require('express-validator')

const regValidation = () => {
  return [
    body('account_firstname')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),
    
    body('account_lastname')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),
    
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    
    body('account_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ]
}

const loginValidation = () => {
  return [
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    
    body('account_password')
      .trim()
      .notEmpty()
      .withMessage('Password is required.'),
  ]
}

const updateAccountValidation = () => {
  return [
    body('account_firstname')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),
    
    body('account_lastname')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),
    
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.')
      .custom(async (account_email, {req}) => {
        const account_id = req.body.account_id
        const account = await accountModel.getAccountByEmail(account_email)
        if (account && account.account_id != account_id){
          throw new Error("Email exists. Please use different email")
        }
      }),
  ]
}

const updatePasswordValidation = () => {
  return [
    body('account_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ]
}

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.post('/login', loginValidation(), utilities.handleErrors(accountController.accountLogin))

router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.post('/register', regValidation(), utilities.handleErrors(accountController.registerAccount))

router.get('/', utilities.checkJWTToken, utilities.handleErrors(accountController.buildAccountManagement))
router.get('/update/', utilities.checkJWTToken, utilities.handleErrors(accountController.buildAccountUpdate))
router.post('/update/', updateAccountValidation(), utilities.checkJWTToken, utilities.handleErrors(accountController.updateAccount))
router.post('/update-password', updatePasswordValidation(), utilities.checkJWTToken, utilities.handleErrors(accountController.updatePassword))

router.get('/logout', utilities.handleErrors(accountController.accountLogout))

module.exports = router
