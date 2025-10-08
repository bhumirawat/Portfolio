import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Add this
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInclude: ['**/*.pdf'], 
  },
  define: {
    'process.env': {}
  },
  preview: {
    port: 3000,
    host: true
  },
  // Remove base or set to empty
  base: './',
  publicDir: 'public',
})