import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

/**
 * Home page component
 * Main layout that combines Dashboard, TransactionForm, and TransactionList
 */
function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Personal Finance Dashboard</h1>
      </header>
      
      <main style={styles.main}>
        {/* Dashboard Summary */}
        <section style={styles.section}>
          <Dashboard />
        </section>

        {/* Add Transaction Form */}
        <section style={styles.section}>
          <TransactionForm />
        </section>

        {/* Transaction History List */}
        <section style={styles.section}>
          <TransactionList />
        </section>
      </main>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    textAlign: 'center',
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  section: {
    marginBottom: '20px',
  },
};

export default Home;