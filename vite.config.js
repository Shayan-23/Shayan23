import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'styles/base': ['./src/styles/base.css'],
          'styles/components': ['./src/styles/components.css'],
          'styles/mobile': ['./src/styles/mobile.css'],
          'styles/dark': ['./src/styles/dark-theme.css'],
          'styles/animations': ['./src/styles/animations.css'],
        }
      }
    }
  }
})
