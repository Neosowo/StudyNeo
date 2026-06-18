import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build'
  
  return {
    base: isProd ? '/StudyNeo/' : '/',
    plugins: [react()],
    build: {
      outDir: 'docs',
      rollupOptions: {
        input: {
          main:       './index.html',
          donar:      './donar.html',
          privacidad: './privacidad.html',
          terminos:   './terminos.html',
        }
      }
    }
  }
})
