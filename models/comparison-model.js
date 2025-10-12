const pool = require("../database/")

/* ***************************
 * Get vehicles for comparison by IDs
 * ************************** */
async function getVehiclesForComparison(vehicleIds) {
  try {
    const placeholders = vehicleIds.map((_, index) => `$${index + 1}`).join(',')
    const sql = `
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c ON i.classification_id = c.classification_id
      WHERE i.inv_id IN (${placeholders})
      ORDER BY i.inv_id
    `
    const data = await pool.query(sql, vehicleIds)
    return data
  } catch (error) {
    console.error("getVehiclesForComparison error: " + error)
    throw error
  }
}

/* ***************************
 * Save a vehicle comparison
 * ************************** */
async function saveComparison(sessionId, vehicleIds, comparisonName, accountId = null) {
  try {
    const sql = `
      INSERT INTO public.vehicle_comparisons (session_id, vehicle_ids, comparison_name, account_id)
      VALUES ($1, $2, $3, $4)
      RETURNING comparison_id
    `
    const data = await pool.query(sql, [sessionId, vehicleIds, comparisonName, accountId])
    return data
  } catch (error) {
    console.error("saveComparison error: " + error)
    throw error
  }
}

/* ***************************
 * Get saved comparisons for a session or account
 * ************************** */
async function getSavedComparisons(sessionId, accountId = null) {
  try {
    let sql, params
    if (accountId) {
      sql = `
        SELECT comparison_id, comparison_name, vehicle_ids, comparison_date
        FROM public.vehicle_comparisons
        WHERE account_id = $1 OR session_id = $2
        ORDER BY comparison_date DESC
      `
      params = [accountId, sessionId]
    } else {
      sql = `
        SELECT comparison_id, comparison_name, vehicle_ids, comparison_date
        FROM public.vehicle_comparisons
        WHERE session_id = $1 AND account_id IS NULL
        ORDER BY comparison_date DESC
      `
      params = [sessionId]
    }
    const data = await pool.query(sql, params)
    return data
  } catch (error) {
    console.error("getSavedComparisons error: " + error)
    throw error
  }
}

/* ***************************
 * Delete a saved comparison
 * ************************** */
async function deleteComparison(comparisonId, sessionId, accountId = null) {
  try {
    let sql, params
    if (accountId) {
      sql = `
        DELETE FROM public.vehicle_comparisons
        WHERE comparison_id = $1 AND (account_id = $2 OR session_id = $3)
      `
      params = [comparisonId, accountId, sessionId]
    } else {
      sql = `
        DELETE FROM public.vehicle_comparisons
        WHERE comparison_id = $1 AND session_id = $2 AND account_id IS NULL
      `
      params = [comparisonId, sessionId]
    }
    const data = await pool.query(sql, params)
    return data
  } catch (error) {
    console.error("deleteComparison error: " + error)
    throw error
  }
}

/* ***************************
 * Get comparison by ID
 * ************************** */
async function getComparisonById(comparisonId, sessionId, accountId = null) {
  try {
    let sql, params
    if (accountId) {
      sql = `
        SELECT comparison_id, comparison_name, vehicle_ids, comparison_date
        FROM public.vehicle_comparisons
        WHERE comparison_id = $1 AND (account_id = $2 OR session_id = $3)
      `
      params = [comparisonId, accountId, sessionId]
    } else {
      sql = `
        SELECT comparison_id, comparison_name, vehicle_ids, comparison_date
        FROM public.vehicle_comparisons
        WHERE comparison_id = $1 AND session_id = $2 AND account_id IS NULL
      `
      params = [comparisonId, sessionId]
    }
    const data = await pool.query(sql, params)
    return data
  } catch (error) {
    console.error("getComparisonById error: " + error)
    throw error
  }
}

module.exports = {
  getVehiclesForComparison,
  saveComparison,
  getSavedComparisons,
  deleteComparison,
  getComparisonById
}