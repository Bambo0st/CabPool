import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://api:3000', // Use Docker service name
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
