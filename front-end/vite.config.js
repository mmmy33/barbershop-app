import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.18.213:8000',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '/api'), 
      }
    }
  },
})

