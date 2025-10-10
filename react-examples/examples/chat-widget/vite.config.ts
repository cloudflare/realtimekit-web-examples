import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
	base: './',
	plugins: [react()],
});
