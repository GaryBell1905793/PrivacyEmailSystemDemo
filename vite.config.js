import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/PrivacyEmailSystemDemo/',
  server: {
    port: 5060,
    host: true
  }
})
