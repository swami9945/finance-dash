import { useState, useContext, useMemo } from 'react';
import FinanceContext from '../context/FinanceContext';

/**
 * TransactionList component for displaying all transactions
 * Shows transaction details and allows delete/edit operations
 * Supports filtering, sorting, and searching
 */
function TransactionList() {
  const { transactions, deleteTransaction, updateTransaction } = useContext(FinanceContext);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // State for filter, sort, and search
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories for dropdown
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

  /**
   * Filter, sort, and search transactions
   */
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    // Search by category or note
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(query) ||
          (t.note && t.note.toLowerCase().includes(query))
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [transactions, filterType, sortOrder, searchQuery]);

  /**
   * Format amount with currency symbol
   */
  const formatAmount = (amount, type) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  /**
   * Format date to readable format
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Start editing a transaction
   */
  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  /**
   * Save the edited transaction
   */
  const saveEdit = () => {
    if (!editForm.amount || !editForm.category || !editForm.date) {
      return;
    }
    const numAmount = parseFloat(editForm.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    updateTransaction({
      ...editForm,
      amount: numAmount,
    });
    setEditingId(null);
    setEditForm({});
  };

  /**
   * Handle edit form changes
   */
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Show message if no transactions exist
  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>Transaction History</h2>
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          <p>No transactions yet. Add your first transaction above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Transaction History</h2>
      
      {/* Filter, Sort, Search Controls */}
      <div className="filter-bar">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-select"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="form-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          placeholder="Search category or note..."
        />
      </div>

      {/* Results count */}
      <p style={{ padding: '0.75rem 1.5rem', margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </p>
      
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="transaction-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {editingId === transaction.id ? (
              // Edit Mode
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.amount}
                    onChange={(e) => handleEditChange('amount', e.target.value)}
                    className="form-input"
                    style={{ flex: '1', minWidth: '100px' }}
                  />
                  <select
                    value={editForm.type}
                    onChange={(e) => handleEditChange('type', e.target.value)}
                    className="form-select"
                    style={{ flex: '1', minWidth: '100px' }}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <select
                    value={editForm.category}
                    onChange={(e) => handleEditChange('category', e.target.value)}
                    className="form-select"
                    style={{ flex: '1', minWidth: '100px' }}
                  >
                    <option value="">Select</option>
                    {(editForm.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => handleEditChange('date', e.target.value)}
                    className="form-input"
                    style={{ flex: '1', minWidth: '120px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={editForm.note || ''}
                    onChange={(e) => handleEditChange('note', e.target.value)}
                    className="form-input"
                    placeholder="Note"
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={saveEdit} className="btn btn-primary btn-sm">Save</button>
                  <button onClick={cancelEdit} className="btn btn-sm" style={{ background: 'var(--border)', color: 'var(--text-primary)' }}>Cancel</button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="transaction-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="transaction-category">{transaction.category}</span>
                    <span className={`transaction-amount ${transaction.type}`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                    {transaction.note && (
                      <span className="transaction-note">{transaction.note}</span>
                    )}
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '10px', 
                      fontSize: '11px', 
                      textTransform: 'uppercase',
                      backgroundColor: transaction.type === 'income' ? 'var(--success-light)' : 'var(--danger-light)',
                      color: transaction.type === 'income' ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {transaction.type}
                    </span>
                  </div>
                </div>
                <div className="transaction-actions">
                  <button
                    onClick={() => startEdit(transaction)}
                    className="btn btn-sm"
                    style={{ background: 'var(--primary-light)', color: 'white' }}
                    aria-label={`Edit ${transaction.category} transaction`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="btn btn-danger btn-sm"
                    aria-label={`Delete ${transaction.category} transaction`}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;import { useState, useContext, useMemo } from 'react';
import FinanceContext from '../context/FinanceContext';

/**
 * TransactionList component for displaying all transactions
 * Shows transaction details and allows delete/edit operations
 * Supports filtering, sorting, and searching
 */
function TransactionList() {
  const { transactions, deleteTransaction, updateTransaction } = useContext(FinanceContext);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // State for filter, sort, and search
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories for dropdown
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

  /**
   * Filter, sort, and search transactions
   */
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    // Search by category or note
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(query) ||
          (t.note && t.note.toLowerCase().includes(query))
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [transactions, filterType, sortOrder, searchQuery]);

  /**
   * Format amount with currency symbol
   */
  const formatAmount = (amount, type) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  /**
   * Format date to readable format
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Start editing a transaction
   */
  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  /**
   * Save the edited transaction
   */
  const saveEdit = () => {
    if (!editForm.amount || !editForm.category || !editForm.date) {
      return;
    }
    const numAmount = parseFloat(editForm.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    updateTransaction({
      ...editForm,
      amount: numAmount,
    });
    setEditingId(null);
    setEditForm({});
  };

  /**
   * Handle edit form changes
   */
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Show message if no transactions exist
  if (transactions.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Transaction History</h2>
        <p style={styles.emptyMessage}>No transactions yet. Add your first transaction above!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Transaction History</h2>
      
      {/* Filter, Sort, Search Controls */}
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={styles.controlSelect}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.controlSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.controlInput}
            placeholder="Category or note..."
          />
        </div>
      </div>

      {/* Results count */}
      <p style={styles.resultsCount}>
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </p>
      <div style={styles.list}>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            style={styles.transactionItem}
          >
            {editingId === transaction.id ? (
              // Edit Mode
              <div style={styles.editForm}>
                <div style={styles.editRow}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.amount}
                    onChange={(e) => handleEditChange('amount', e.target.value)}
                    style={styles.editInput}
                  />
                  <select
                    value={editForm.type}
                    onChange={(e) => handleEditChange('type', e.target.value)}
                    style={styles.editSelect}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <select
                    value={editForm.category}
                    onChange={(e) => handleEditChange('category', e.target.value)}
                    style={styles.editSelect}
                  >
                    <option value="">Select</option>
                    {(editForm.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => handleEditChange('date', e.target.value)}
                    style={styles.editInput}
                  />
                </div>
                <div style={styles.editRow}>
                  <input
                    type="text"
                    value={editForm.note || ''}
                    onChange={(e) => handleEditChange('note', e.target.value)}
                    style={styles.editInput}
                    placeholder="Note"
                  />
                </div>
                <div style={styles.editActions}>
                  <button onClick={saveEdit} style={styles.saveButton}>Save</button>
                  <button onClick={cancelEdit} style={styles.cancelButton}>Cancel</button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div style={styles.transactionInfo}>
                  <div style={styles.transactionMain}>
                    <span style={styles.category}>{transaction.category}</span>
                    <span
                      style={{
                        ...styles.amount,
                        color: transaction.type === 'income' ? '#4CAF50' : '#f44336',
                      }}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </div>
                  <div style={styles.transactionDetails}>
                    <span style={styles.date}>{formatDate(transaction.date)}</span>
                    {transaction.note && (
                      <span style={styles.note}>{transaction.note}</span>
                    )}
                    <span style={styles.typeBadge}>
                      {transaction.type}
                    </span>
                  </div>
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => startEdit(transaction)}
                    style={styles.editButton}
                    aria-label={`Edit ${transaction.category} transaction`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    style={styles.deleteButton}
                    aria-label={`Delete ${transaction.category} transaction`}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#333',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  transactionItem: {
    padding: '12px',
    border: '1px solid #eee',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
  },
  transactionInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  transactionMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  transactionDetails: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '13px',
    color: '#666',
  },
  date: {
    color: '#888',
  },
  note: {
    fontStyle: 'italic',
    color: '#666',
  },
  typeBadge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    textTransform: 'uppercase',
    backgroundColor: '#e0e0e0',
    color: '#555',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  editButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  editRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  editInput: {
    padding: '6px',
    fontSize: '13px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '1',
    minWidth: '80px',
  },
  editSelect: {
    padding: '6px',
    fontSize: '13px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '1',
    minWidth: '80px',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
  },
  saveButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px',
    padding: '20px',
  },
};

export default TransactionList;