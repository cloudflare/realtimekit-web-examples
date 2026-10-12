import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// NOTE: Not using StrictMode to avoid initializing the meeting twice in development
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
