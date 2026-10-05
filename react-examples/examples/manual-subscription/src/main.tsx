import ReactDOM from 'react-dom/client';
import { provideRtkDesignSystem } from '@cloudflare/realtimekit-react-ui';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing root element');

provideRtkDesignSystem(document.documentElement, { theme: 'darkest' });

ReactDOM.createRoot(root).render(
  // NOTE: Not using StrictMode to avoid the double execution of useEffect
  // while trying out the example
  <App />
);
