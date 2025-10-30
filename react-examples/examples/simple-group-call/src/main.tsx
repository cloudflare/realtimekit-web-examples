import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { provideRtkDesignSystem } from '@cloudflare/realtimekit-react-ui';

provideRtkDesignSystem(document.body, {
  theme: 'light',
  googleFont: 'Inter',
  colors: {
    'video-bg': '#ebebeb',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // NOTE: Not using StrictMode to avoid the double execution of useEffect
  // while trying out the example
  <App />
);
