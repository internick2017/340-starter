const jwt = require("jsonwebtoken")
const accountModel = require("../models/account-model")

async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.redirect('/account/login')
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'default-secret')
    req.accountData = decoded
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    res.clearCookie('jwt')
    res.redirect('/account/login')
  }
}

async function requireLogin(req, res, next) {
  if (!req.cookies.jwt) {
    return res.redirect('/account/login')
  }
  next()
}

async function requireAdmin(req, res, next) {
  if (!req.cookies.jwt) {
    return res.redirect('/account/login')
  }
  
  try {
    const token = req.cookies.jwt
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'default-secret')
    
    if (decoded.account_type !== 'Admin') {
      return res.redirect('/account/')
    }
    
    req.accountData = decoded
    next()
  } catch (error) {
    console.error('Admin verification error:', error)
    res.clearCookie('jwt')
    res.redirect('/account/login')
  }
}

module.exports = {
  verifyToken,
  requireLogin,
  requireAdmin
}
