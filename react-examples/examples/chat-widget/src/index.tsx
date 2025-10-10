import App from './components/App';
import './index.css';
import { provideRtkDesignSystem } from '@cloudflare/realtimekit-react-ui';
import { createRoot } from 'react-dom/client';

// change theme to light
provideRtkDesignSystem(document.body, {
	theme: 'light',
	colors: {
		background: {
			1000: '#FFFFFF',
			900: '#F5F5F5',
			800: '#EBEBEB',
			700: '#E0E0E0',
			600: '#D6D6D6',
		},
		text: '#111111',
		'text-on-brand': '#ffffff',
		'video-bg': '#DADADA',
	},
});

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
