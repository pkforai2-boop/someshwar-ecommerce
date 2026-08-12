import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/someshwar-ecommerce/',
  server: {
    port: 3000,
    open: true
  }
})
