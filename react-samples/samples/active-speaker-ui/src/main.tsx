import App from './App';
import './index.css';
import { provideRtkDesignSystem } from '@cloudflare/realtimekit-react-ui';
import ReactDOM from 'react-dom/client';

provideRtkDesignSystem(document.body, {
  theme: 'darkest',
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // NOTE: Not using StrictMode to avoid the double execution of useEffect
  // while trying out the sample
  <App />
);
