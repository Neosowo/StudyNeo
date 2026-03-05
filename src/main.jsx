import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext.jsx'

// Apply saved theme immediately before React renders to prevent flash
const savedTheme = localStorage.getItem('sd_theme') || 'dark'
document.documentElement.setAttribute('data-theme', savedTheme)

// Register Service Worker for Ad-Blocking
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('🛡️ Ad-Blocker SW Registrado'))
      .catch(err => console.log('⚠️ SW Error:', err));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
