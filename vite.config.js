import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build'
  
  return {
    // Si despliegas en neosowo.github.io/StudyNeo/, el base debe ser '/StudyNeo/'
    // Si despliegas en la raíz de neosowo.github.io, el base debe ser '/'
    // Usamos './' como fallback, pero '/StudyNeo/' es más seguro para GitHub Pages
    base: isProd ? '/StudyNeo/' : '/',
    plugins: [react()],
    build: {
      outDir: 'docs',
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
  }
})
