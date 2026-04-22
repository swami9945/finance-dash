import { FinanceProvider } from './context/FinanceContext';
import Home from './pages/Home';

function App() {
  return (
    <FinanceProvider>
      <Home />
    </FinanceProvider>
  );
}

export default App;