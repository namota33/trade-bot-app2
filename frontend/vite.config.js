import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://trade-bot-app2.onrender.com', // seu backend Render
        changeOrigin: true,
        secure: false
      }
    }
  }
});
