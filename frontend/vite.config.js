import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Saat development, request ke /api diteruskan ke backend Go (port 8080),
// jadi frontend cukup memanggil "/api/..." tanpa menulis alamat lengkap.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
