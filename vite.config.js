import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        foro: './foro.html',
        donar: './donar.html',
        privacidad: './privacidad.html',
        terminos: './terminos.html'
      }
    }
  }
})
