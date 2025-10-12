const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator')

const accountController = {}

accountController.buildLogin = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login", 
    nav,
    errors: null,
  })
}

accountController.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

accountController.buildAccountManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

accountController.buildAccountUpdate = async function(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData
  })
}

accountController.accountLogin = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
  }

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)
    
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
    
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  let hashPassword
  try {
    hashPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

accountController.updateAccount = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(400).render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      accountData
    })
  }

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", `${account_firstname}, your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/account/update/")
  }
}

accountController.updatePassword = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(400).render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      accountData
    })
  }

  let hashPassword
  try {
    hashPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    return res.redirect("/account/update/")
  }

  const updateResult = await accountModel.updatePassword(hashPassword, account_id)

  if (updateResult) {
    req.flash("notice", "Your password was successfully updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.redirect("/account/update/")
  }
}

accountController.accountLogout = async function(req, res, next) {
  res.clearCookie("jwt")
  return res.redirect("/")
}

module.exports = accountController
