import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://barbershop-backend-staging-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
    hmr: {
      host: '192.168.18.213',
      port: 3000,
    },
  },
});

