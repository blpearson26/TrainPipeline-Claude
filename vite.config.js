import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // IMPORTANT: Replace 'training-management-app' with YOUR actual repository name
  base: process.env.NODE_ENV === 'production' ? '/training-management-app/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
