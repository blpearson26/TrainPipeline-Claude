import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Replace with your repository name
  base: process.env.NODE_ENV === 'production' ? '/training-management-app/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})