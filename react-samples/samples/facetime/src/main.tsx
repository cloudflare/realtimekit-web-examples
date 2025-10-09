import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // NOTE: Not using StrictMode to avoid the double execution of useEffect
  // while trying out the sample
  <App />
);
