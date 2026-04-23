import { createContext, useState, useEffect } from 'react';

// Create the Finance Context
const FinanceContext = createContext();

// LocalStorage key for persistence
const STORAGE_KEY = 'finance_transactions';

/**
 * FinanceProvider component that wraps the application
 * and provides global state for transactions
 */
export function FinanceProvider({ children }) {
  // Initialize state from localStorage or use empty array
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored transactions:', e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  /**
   * Add a new transaction to the state
   * @param {Object} transaction - The transaction object to add
   */
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  /**
   * Delete a transaction by its ID
   * @param {string} id - The ID of the transaction to delete
   */
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Update an existing transaction
   * @param {Object} updatedTransaction - The updated transaction object
   */
  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  // Provide the context value
  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceContext;