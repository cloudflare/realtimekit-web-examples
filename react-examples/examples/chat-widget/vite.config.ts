import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
	base: '/chat-widget/',
	plugins: [react()],
});
