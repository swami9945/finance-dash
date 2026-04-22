import { useContext } from 'react';
import FinanceContext from '../context/FinanceContext';
import { getTotalIncome, getTotalExpense, getBalance } from '../utils/calculations';

/**
 * Dashboard component for displaying financial summary
 * Shows total income, total expense, and current balance
 */
function Dashboard() {
  const { transactions } = useContext(FinanceContext);

  // Calculate values using utility functions
  const totalIncome = getTotalIncome(transactions);
  const totalExpense = getTotalExpense(transactions);
  const balance = getBalance(transactions);

  /**
   * Format amount with currency symbol
   * @param {number} amount - The amount to format
   * @returns {string} Formatted amount string
   */
  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Financial Summary</h2>
      <div style={styles.summaryGrid}>
        {/* Income Card */}
        <div style={{ ...styles.card, ...styles.incomeCard }}>
          <h3 style={styles.cardTitle}>Total Income</h3>
          <p style={{ ...styles.cardAmount, color: '#4CAF50' }}>
            {formatAmount(totalIncome)}
          </p>
        </div>

        {/* Expense Card */}
        <div style={{ ...styles.card, ...styles.expenseCard }}>
          <h3 style={styles.cardTitle}>Total Expense</h3>
          <p style={{ ...styles.cardAmount, color: '#f44336' }}>
            {formatAmount(totalExpense)}
          </p>
        </div>

        {/* Balance Card */}
        <div
          style={{
            ...styles.card,
            ...styles.balanceCard,
            borderColor: balance >= 0 ? '#4CAF50' : '#f44336',
          }}
        >
          <h3 style={styles.cardTitle}>Current Balance</h3>
          <p
            style={{
              ...styles.cardAmount,
              color: balance >= 0 ? '#4CAF50' : '#f44336',
            }}
          >
            {formatAmount(balance)}
          </p>
        </div>
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
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#333',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  card: {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '2px solid #eee',
    textAlign: 'center',
  },
  incomeCard: {
    borderLeft: '4px solid #4CAF50',
  },
  expenseCard: {
    borderLeft: '4px solid #f44336',
  },
  balanceCard: {
    borderLeft: '4px solid #2196F3',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  cardAmount: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
  },
};

export default Dashboard;