/**
 * Utility functions for financial calculations
 */

/**
 * Calculate total income from all transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total income amount
 */
export function getTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total expenses from all transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total expense amount
 */
export function getTotalExpense(transactions) {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate balance (income - expenses)
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Current balance
 */
export function getBalance(transactions) {
  const income = getTotalIncome(transactions);
  const expense = getTotalExpense(transactions);
  return income - expense;
}