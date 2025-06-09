// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // ou remova essa linha se não estiver usando subpasta como root
  build: {
    outDir: 'dist',
  },
})
