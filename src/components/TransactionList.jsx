import { useContext } from 'react';
import FinanceContext from '../context/FinanceContext';

/**
 * TransactionList component for displaying all transactions
 * Shows transaction details and delete button for each item
 */
function TransactionList() {
  const { transactions, deleteTransaction } = useContext(FinanceContext);

  /**
   * Format amount with currency symbol
   * @param {number} amount - The amount to format
   * @param {string} type - Transaction type (income/expense)
   * @returns {string} Formatted amount string
   */
  const formatAmount = (amount, type) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  /**
   * Format date to readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <div style={styles.list}>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            style={styles.transactionItem}
          >
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
            <button
              onClick={() => deleteTransaction(transaction.id)}
              style={styles.deleteButton}
              aria-label={`Delete ${transaction.category} transaction`}
            >
              Delete
            </button>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  deleteButton: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '15px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px',
    padding: '20px',
  },
};

export default TransactionList;