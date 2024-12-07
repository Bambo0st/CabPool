import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173, // Frontend port
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000', // Fallback to localhost if not set
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
