import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './src/entry-client.tsx',
    },
    outDir: 'dist/client',
  },
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
  },
});
