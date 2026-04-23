import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

/**
 * Home page component
 * Main layout that combines Dashboard, TransactionForm, and TransactionList
 */
function Home() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Personal Finance Dashboard</h1>
      </header>
      
      <main className="main-content">
        {/* Dashboard Summary */}
        <section className="content-section">
          <Dashboard />
        </section>

        {/* Add Transaction Form */}
        <section className="content-section">
          <TransactionForm />
        </section>

        {/* Transaction History List */}
        <section className="content-section">
          <TransactionList />
        </section>
      </main>
    </div>
  );
}

export default Home;