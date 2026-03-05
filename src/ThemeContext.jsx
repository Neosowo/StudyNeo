import { createContext, useContext, useLayoutEffect } from 'react'
import { useLocalStorage } from './panel/hooks/useLocalStorage'

/**
 * Each theme can have variants. When a variant is selected,
 * it is stored as `${themeId}__${variantId}` in localStorage.
 * The CSS class is `data-theme="${themeId}__${variantId}"` or
 * just `data-theme="${themeId}"` for the base variant.
 */
export const THEMES = [
    {
        id: 'dark',
        name: 'Oscuro',
        emoji: '🌑',
        preview: { bg: '#0c0c0e', surface: '#111113', accent: '#A89BF2', text: '#ffffff' },
        category: 'Oscuro',
        variants: [
            { id: 'dark', label: 'Clásico', preview: { bg: '#0c0c0e', surface: '#111113', accent: '#A89BF2', text: '#ffffff' } },
            { id: 'dark__midnight', label: 'Midnight', preview: { bg: '#060610', surface: '#0d0d1a', accent: '#7b6cf6', text: '#e2e0ff' } },
            { id: 'dark__carbon', label: 'Carbon', preview: { bg: '#111111', surface: '#1a1a1a', accent: '#60a5fa', text: '#e5e7eb' } },
        ],
    },
    {
        id: 'tokyonight',
        name: 'Tokyo Night',
        emoji: '🏙️',
        preview: { bg: '#1a1b26', surface: '#24283b', accent: '#7aa2f7', text: '#cfc9c2' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'tokyonight', label: 'Night', preview: { bg: '#1a1b26', surface: '#24283b', accent: '#7aa2f7', text: '#cfc9c2' } },
            { id: 'tokyonight__storm', label: 'Storm', preview: { bg: '#24283b', surface: '#1f2335', accent: '#7dcfff', text: '#c0caf5' } },
            { id: 'tokyonight__day', label: 'Day', preview: { bg: '#e1e2e7', surface: '#f5f5f5', accent: '#2e7de9', text: '#3760bf' } },
        ],
    },
    {
        id: 'nightowl',
        name: 'Night Owl',
        emoji: '🦉',
        preview: { bg: '#011627', surface: '#0b2942', accent: '#7fdbca', text: '#d6deeb' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'nightowl', label: 'Night Owl', preview: { bg: '#011627', surface: '#0b2942', accent: '#7fdbca', text: '#d6deeb' } },
            { id: 'nightowl__light', label: 'Light Owl', preview: { bg: '#fbfbfb', surface: '#ffffff', accent: '#403f53', text: '#403f53' } },
        ],
    },
    {
        id: 'dracula',
        name: 'Dracula',
        emoji: '🧛',
        preview: { bg: '#282a36', surface: '#44475a', accent: '#ff79c6', text: '#f8f8f2' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'dracula', label: 'Dracula', preview: { bg: '#282a36', surface: '#44475a', accent: '#ff79c6', text: '#f8f8f2' } },
            { id: 'dracula__soft', label: 'Soft', preview: { bg: '#22212c', surface: '#34324a', accent: '#ea9a97', text: '#e0def4' } },
        ],
    },
    {
        id: 'aura',
        name: 'Aura',
        emoji: '✨',
        preview: { bg: '#151718', surface: '#1b1d1e', accent: '#a277ff', text: '#edecee' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'aura', label: 'Dark', preview: { bg: '#151718', surface: '#1b1d1e', accent: '#a277ff', text: '#edecee' } },
            { id: 'aura__soft', label: 'Soft Dark', preview: { bg: '#1a1825', surface: '#221e31', accent: '#c39bf4', text: '#edecee' } },
        ],
    },
    {
        id: 'catppuccin',
        name: 'Catppuccin',
        emoji: '🐈',
        preview: { bg: '#1e1e2e', surface: '#313244', accent: '#cba6f7', text: '#cdd6f4' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'catppuccin', label: 'Mocha', preview: { bg: '#1e1e2e', surface: '#313244', accent: '#cba6f7', text: '#cdd6f4' } },
            { id: 'catppuccin__macchiato', label: 'Macchiato', preview: { bg: '#24273a', surface: '#363a4f', accent: '#c6a0f6', text: '#cad3f5' } },
            { id: 'catppuccin__frappe', label: 'Frappé', preview: { bg: '#303446', surface: '#414559', accent: '#ca9ee6', text: '#c6d0f5' } },
        ],
    },
    {
        id: 'palenight',
        name: 'Palenight',
        emoji: '🌌',
        preview: { bg: '#292d3e', surface: '#32374d', accent: '#c792ea', text: '#bfc7d5' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'andromeda',
        name: 'Andromeda',
        emoji: '🛸',
        preview: { bg: '#23262e', surface: '#2b303b', accent: '#00e8c6', text: '#d5d8da' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'andromeda', label: 'Classic', preview: { bg: '#23262e', surface: '#2b303b', accent: '#00e8c6', text: '#d5d8da' } },
            { id: 'andromeda__vibrant', label: 'Vibrant', preview: { bg: '#1e2029', surface: '#2b303b', accent: '#f92aad', text: '#d5d8da' } },
        ],
    },
    {
        id: 'synthwave',
        name: 'SynthWave 84',
        emoji: '🌆',
        preview: { bg: '#262335', surface: '#241b2f', accent: '#ff7edb', text: '#ffffff' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'synthwave', label: 'Classic', preview: { bg: '#262335', surface: '#241b2f', accent: '#ff7edb', text: '#ffffff' } },
            { id: 'synthwave__dusk', label: 'Dusk', preview: { bg: '#1a1a2e', surface: '#16213e', accent: '#e94560', text: '#eaeaea' } },
        ],
    },
    {
        id: 'fairyfloss',
        name: 'Fairy Floss',
        emoji: '🍭',
        preview: { bg: '#5a5475', surface: '#685e8a', accent: '#ff85b8', text: '#f8f8f2' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'rosepine_moon',
        name: 'Rosé Pine Moon',
        emoji: '🌙',
        preview: { bg: '#232136', surface: '#2a273f', accent: '#ea9a97', text: '#e0def4' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'rosepine_moon', label: 'Moon', preview: { bg: '#232136', surface: '#2a273f', accent: '#ea9a97', text: '#e0def4' } },
            { id: 'rosepine_moon__main', label: 'Main', preview: { bg: '#191724', surface: '#1f1d2e', accent: '#ebbcba', text: '#e0def4' } },
        ],
    },
    {
        id: 'pinkcatboo',
        name: 'Pink Cat Boo',
        emoji: '🐈‍⬛',
        preview: { bg: '#191724', surface: '#1f1d2e', accent: '#eb6f92', text: '#e0def4' },
        category: 'Oscuro',
        premium: true,
        variants: [
            { id: 'pinkcatboo', label: 'Classic', preview: { bg: '#191724', surface: '#1f1d2e', accent: '#eb6f92', text: '#e0def4' } },
            { id: 'pinkcatboo__neon', label: 'Neon', preview: { bg: '#13111c', surface: '#1e1a2e', accent: '#f92aad', text: '#edecee' } },
        ],
    },
    {
        id: 'amethyst',
        name: 'Amethyst',
        emoji: '🔮',
        preview: { bg: '#211e2e', surface: '#2a273f', accent: '#f92672', text: '#edecee' },
        category: 'Oscuro',
        premium: true,
    },
    {
        id: 'bimbo',
        name: 'Bimbo Theme',
        emoji: '💃',
        preview: { bg: '#16000d', surface: '#2b001a', accent: '#ff00ff', text: '#ffffff' },
        category: 'Oscuro',
        premium: true,
    },
    // ─── Light themes ───────────────────────────────────────────────
    {
        id: 'light',
        name: 'Claro',
        emoji: '☀️',
        preview: { bg: '#EEEEF5', surface: '#FFFFFF', accent: '#7059D4', text: '#08080E' },
        category: 'Claro',
        variants: [
            { id: 'light', label: 'Violet', preview: { bg: '#EEEEF5', surface: '#FFFFFF', accent: '#7059D4', text: '#08080E' } },
            { id: 'light__blue', label: 'Blue', preview: { bg: '#EEF2FF', surface: '#FFFFFF', accent: '#4f6fe0', text: '#1e1b4b' } },
            { id: 'light__green', label: 'Sage', preview: { bg: '#ecf3ee', surface: '#FFFFFF', accent: '#3a7d5a', text: '#0d2818' } },
        ],
    },
    {
        id: 'rosepine_dawn',
        name: 'Rosé Pine Dawn',
        emoji: '🌅',
        preview: { bg: '#faf4ed', surface: '#fffaf3', accent: '#d7827e', text: '#575279' },
        category: 'Claro',
        premium: true,
    },
    {
        id: 'catppuccin_latte',
        name: 'Catppuccin Latte',
        emoji: '☕',
        preview: { bg: '#eff1f5', surface: '#e6e9ef', accent: '#ea76cb', text: '#4c4f69' },
        category: 'Claro',
        premium: true,
        variants: [
            { id: 'catppuccin_latte', label: 'Latte', preview: { bg: '#eff1f5', surface: '#e6e9ef', accent: '#ea76cb', text: '#4c4f69' } },
            { id: 'catppuccin_latte__rosewater', label: 'Rosewater', preview: { bg: '#eff1f5', surface: '#fbe4e4', accent: '#d20f39', text: '#4c4f69' } },
        ],
    },
    {
        id: 'kawaii',
        name: 'Kawaii',
        emoji: '🧸',
        preview: { bg: '#fff0f5', surface: '#ffffff', accent: '#ff69b4', text: '#4d0026' },
        category: 'Claro',
        premium: true,
        variants: [
            { id: 'kawaii', label: 'Sakura', preview: { bg: '#fff0f5', surface: '#ffffff', accent: '#ff69b4', text: '#4d0026' } },
            { id: 'kawaii__mint', label: 'Mint', preview: { bg: '#f0fff8', surface: '#ffffff', accent: '#00b894', text: '#004d26' } },
            { id: 'kawaii__lavender', label: 'Lavender', preview: { bg: '#f3f0ff', surface: '#ffffff', accent: '#9B59B6', text: '#2c0057' } },
        ],
    },
]

/** Get the base theme object by any variant ID */
export function getBaseTheme(themeId) {
    const base = themeId?.split('__')[0]
    return THEMES.find(t => t.id === base) || THEMES[0]
}

/** Extract variant preview colors (for Settings preview) */
export function getThemePreview(themeId) {
    const base = getBaseTheme(themeId)
    if (!base.variants) return base.preview
    const variant = base.variants.find(v => v.id === themeId)
    return variant?.preview || base.preview
}

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { }, setTheme: () => { } })

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useLocalStorage('sd_theme', 'dark')

    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('sd_theme', theme)

        // Dynamic Favicon Update
        const baseId = theme.split('__')[0]
        const isLight = ['light', 'rosepine_dawn', 'catppuccin_latte', 'kawaii'].includes(baseId)
        const favicon = document.getElementById('favicon')
        if (favicon) {
            const bg = isLight ? '%23111111' : '%23ffffff'
            const fg = isLight ? '%23ffffff' : '%23111111'
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
