import { useContext, useEffect, useState } from 'react';
import FinanceContext from '../context/FinanceContext';
import { getTotalIncome, getTotalExpense, getBalance } from '../utils/calculations';

/**
 * Dashboard component for displaying financial summary
 * Shows total income, total expense, and current balance
 */
function Dashboard() {
  const { transactions } = useContext(FinanceContext);
  const [animated, setAnimated] = useState(false);

  // Calculate values using utility functions
  const totalIncome = getTotalIncome(transactions);
  const totalExpense = getTotalExpense(transactions);
  const balance = getBalance(transactions);

  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  /**
   * Format amount with currency symbol
   * @param {number} amount - The amount to format
   * @returns {string} Formatted amount string
   */
  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '1.25rem' }}>Financial Summary</h2>
      <div className="summary-grid">
        {/* Income Card */}
        <div className={`summary-card income ${animated ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.1s' }}>
          <h3>Total Income</h3>
          <p className="amount">+{formatAmount(totalIncome)}</p>
        </div>

        {/* Expense Card */}
        <div className={`summary-card expense ${animated ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.2s' }}>
          <h3>Total Expense</h3>
          <p className="amount">-{formatAmount(totalExpense)}</p>
        </div>

        {/* Balance Card */}
        <div className={`summary-card balance ${animated ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.3s' }}>
          <h3>Current Balance</h3>
          <p className="amount" style={{ color: balance >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
            {formatAmount(balance)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;