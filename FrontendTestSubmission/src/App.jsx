import { Log } from '../../loginmiddleware/logger';
import AppRouter from './AppRouter';
import './App.css'

function App() {

  // Log initial render
  Log("frontend", "info", "component", "App component rendered");

  return <AppRouter />;
}

export default App
