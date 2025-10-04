const pool = require("../database/")
const bcrypt = require("bcryptjs")

async function getAccountByEmail(email) {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1"
    const data = await pool.query(sql, [email])
    return data
  } catch (error) {
    console.error("getAccountByEmail error: " + error)
    throw error
  }
}

async function getAccountById(account_id) {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data
  } catch (error) {
    console.error("getAccountById error: " + error)
    throw error
  }
}

async function createAccount(firstname, lastname, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING account_id, account_firstname, account_lastname, account_email, account_type"
    return await pool.query(sql, [firstname, lastname, email, hashedPassword])
  } catch (error) {
    console.error("createAccount error: " + error)
    throw error
  }
}

async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING account_id, account_firstname, account_lastname, account_email, account_type"
    return await pool.query(sql, [firstname, lastname, email, account_id])
  } catch (error) {
    console.error("updateAccount error: " + error)
    throw error
  }
}

async function updatePassword(account_id, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING account_id"
    return await pool.query(sql, [hashedPassword, account_id])
  } catch (error) {
    console.error("updatePassword error: " + error)
    throw error
  }
}

async function checkPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("checkPassword error: " + error)
    throw error
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  createAccount,
  updateAccount,
  updatePassword,
  checkPassword
}
