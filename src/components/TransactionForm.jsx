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
  const [success, setSuccess] = useState(false);

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

    // Show success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    // Reset form
    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setError('');
  };

  return (
    <div className="form-container">
      <h2>Add Transaction</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Transaction added successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Amount Input */}
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="Enter amount"
          />
        </div>

        {/* Type Selection */}
        <div className="form-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory('');
            }}
            className="form-select"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Category Selection */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
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
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Note Input */}
        <div className="form-group">
          <label>Note (Optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="form-input"
            placeholder="Add a note..."
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;