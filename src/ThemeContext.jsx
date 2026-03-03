import { createContext, useContext, useLayoutEffect } from 'react'
import { useLocalStorage } from './panel/hooks/useLocalStorage'

export const THEMES = [
    {
        id: 'dark',
        name: 'Oscuro',
        emoji: '🌑',
        preview: { bg: '#0c0c0e', surface: '#111113', accent: '#A89BF2', text: '#ffffff' },
        category: 'Oscuro',
    },
    {
        id: 'midnight',
        name: 'Medianoche',
        emoji: '🌊',
        preview: { bg: '#06081A', surface: '#0C1028', accent: '#4F7EF7', text: '#ffffff' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'forest',
        name: 'Bosque',
        emoji: '🌲',
        preview: { bg: '#060E08', surface: '#0A1A0D', accent: '#4CAF82', text: '#ffffff' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'rose',
        name: 'Rosa',
        emoji: '🌸',
        preview: { bg: '#120810', surface: '#1E0E1C', accent: '#E87EA1', text: '#ffffff' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'sunset',
        name: 'Sunset',
        emoji: '🌅',
        preview: { bg: '#120A06', surface: '#1E1208', accent: '#F2834A', text: '#ffffff' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'light',
        name: 'Claro',
        emoji: '☀️',
        preview: { bg: '#EEEEF5', surface: '#FFFFFF', accent: '#7059D4', text: '#08080E' },
        category: 'Claro',
    },
    {
        id: 'cream',
        name: 'Crema',
        emoji: '☕',
        preview: { bg: '#F5F0E8', surface: '#FFFDF8', accent: '#8B6E4E', text: '#1A120A' },
        category: 'Claro',
        premium: true,
    },
    {
        id: 'sakura',
        name: 'Sakura',
        emoji: '🌸',
        preview: { bg: '#FFF0F5', surface: '#FFFFFF', accent: '#E8749A', text: '#2D0A16' },
        category: 'Claro',
        premium: true,
    },
]

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { }, setTheme: () => { } })

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useLocalStorage('sd_theme', 'dark')

    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('sd_theme', theme)

        // Dynamic Favicon Update
        const isLight = ['light', 'cream', 'sakura'].includes(theme)
        const favicon = document.getElementById('favicon')
        if (favicon) {
            const bg = isLight ? '%23111111' : '%23ffffff'
            const fg = isLight ? '%23ffffff' : '%23111111'
            // Simplified BookOpen SVG path for data URI
            const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='${bg}'/%3E%3Cpath d='M8 7h5a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H8z M24 7h-5a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h5z' fill='none' stroke='${fg}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E`
            favicon.href = svg
        }
    }, [theme])

    const setTheme = (t) => setThemeState(t)
    const toggleTheme = () => setThemeState(t => t === 'dark' ? 'light' : 'dark')

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
