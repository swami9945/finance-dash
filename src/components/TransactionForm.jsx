import { useState, useContext } from 'react';
import FinanceContext from '../context/FinanceContext';

/**
 * TransactionForm component for adding new transactions
 * Handles form validation and submission
 */
function TransactionForm() {
  const { addTransaction } = useContext(FinanceContext);

  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Common categories for income and expense
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

  // Get categories based on transaction type
  const categories = type === 'income' ? incomeCategories : expenseCategories;

  /**
   * Validate form inputs
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    // Check for empty fields
    if (!amount || !category || !date) {
      setError('All fields are required');
      return false;
    }

    // Check if amount is a valid number greater than 0
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a number greater than 0');
      return false;
    }

    setError('');
    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create new transaction object
    const newTransaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      type,
      category,
      date,
      note,
    };

    // Add transaction via context
    addTransaction(newTransaction);

    // Reset form
    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setError('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Transaction</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Amount Input */}
        <div style={styles.field}>
          <label style={styles.label}>Amount:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="Enter amount"
          />
        </div>

        {/* Type Selection */}
        <div style={styles.field}>
          <label style={styles.label}>Type:</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory('');
            }}
            style={styles.select}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Category Selection */}
        <div style={styles.field}>
          <label style={styles.label}>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div style={styles.field}>
          <label style={styles.label}>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Note Input */}
        <div style={styles.field}>
          <label style={styles.label}>Note:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={styles.input}
            placeholder="Optional note"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={styles.button}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  select: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '4px',
    marginBottom: '15px',
  },
};

export default TransactionForm;