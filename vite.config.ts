import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/liturgia-de-las-horas/',
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
