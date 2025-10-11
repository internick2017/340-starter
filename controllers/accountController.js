const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")

const accountController = {}

accountController.buildLogin = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    messages: req.flash()
  })
}

accountController.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    messages: req.flash()
  })
}

accountController.buildAccountManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.accountData.account_id)
  const account = accountData.rows[0]
  
  let greeting = ""
  if (account.account_type === "Admin") {
    greeting = `Welcome ${account.account_firstname}, you are logged in as an Administrator and may manage the inventory.`
  } else if (account.account_type === "Employee") {
    greeting = `Welcome ${account.account_firstname}, you are logged in as an Employee.`
  } else {
    // For Client type - no greeting should be shown (h2 element should not be present)
    greeting = ""
  }
  
  res.render("./account/account-management", {
    title: "Account Management",
    nav,
    account,
    greeting,
    messages: req.flash()
  })
}

accountController.processLogin = async function(req, res, next) {
  const { email, password } = req.body
  
  try {
    const accountData = await accountModel.getAccountByEmail(email)
    if (accountData.rows.length === 0) {
      req.flash('notice', 'Invalid email or password')
      return res.redirect('/account/login')
    }
    
    const account = accountData.rows[0]
    const passwordMatch = await accountModel.checkPassword(password, account.account_password)
    
    if (!passwordMatch) {
      req.flash('notice', 'Invalid email or password')
      return res.redirect('/account/login')
    }
    
    const token = jwt.sign(
      { 
        account_id: account.account_id,
        account_type: account.account_type,
        account_email: account.account_email,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname
      },
      process.env.ACCESS_TOKEN_SECRET || 'default-secret',
      { expiresIn: '1h' }
    )
    
    res.cookie('jwt', token, { httpOnly: true, secure: false })
    req.flash('notice', 'Login successful')
    res.redirect('/account/')
  } catch (error) {
    console.error('Login error:', error)
    req.flash('notice', 'Login failed')
    res.redirect('/account/login')
  }
}

accountController.processRegister = async function(req, res, next) {
  const { firstname, lastname, email, password } = req.body
  
  console.log('Registration attempt:', { firstname, lastname, email, password: password ? 'provided' : 'missing' })
  
  try {
    const existingAccount = await accountModel.getAccountByEmail(email)
    if (existingAccount.rows.length > 0) {
      console.log('Email already exists:', email)
      req.flash('notice', 'Email already exists')
      return res.redirect('/account/register')
    }
    
    const result = await accountModel.createAccount(firstname, lastname, email, password)
    console.log('Registration successful:', result.rows[0])
    req.flash('notice', 'Registration successful. Please log in.')
    res.redirect('/account/login')
  } catch (error) {
    console.error('Registration error:', error)
    req.flash('notice', 'Registration failed: ' + error.message)
    res.redirect('/account/register')
  }
}

accountController.processAccountUpdate = async function(req, res, next) {
  const { firstname, lastname, email } = req.body
  const account_id = req.accountData.account_id
  
  try {
    await accountModel.updateAccount(account_id, firstname, lastname, email)
    req.flash('notice', 'Account updated successfully')
    res.redirect('/account/')
  } catch (error) {
    console.error('Account update error:', error)
    req.flash('notice', 'Account update failed')
    res.redirect('/account/')
  }
}

accountController.processPasswordUpdate = async function(req, res, next) {
  const { password } = req.body
  const account_id = req.accountData.account_id
  
  try {
    await accountModel.updatePassword(account_id, password)
    req.flash('notice', 'Password updated successfully')
    res.redirect('/account/')
  } catch (error) {
    console.error('Password update error:', error)
    req.flash('notice', 'Password update failed')
    res.redirect('/account/')
  }
}

accountController.processLogout = async function(req, res, next) {
  res.clearCookie('jwt')
  req.flash('notice', 'Logout successful')
  res.redirect('/')
}

module.exports = accountController
