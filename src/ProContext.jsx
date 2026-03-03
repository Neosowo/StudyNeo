/**
 * ProContext.jsx
 * Contexto global de estado Pro, disponible en toda la app del panel.
 */
import { createContext, useContext, useEffect, useRef } from 'react'
import { usePro } from './panel/hooks/usePro'
import { useTheme, THEMES } from './ThemeContext'

export const ProContext = createContext({ isPro: false, proInfo: null, loading: false, error: null, activateCode: async () => false, setError: () => { } })

export function ProProvider({ children }) {
    const pro = usePro()
    const { theme, setTheme } = useTheme()
    const prevProRef = useRef(pro.isPro)

    // Watch for Pro status change from true -> false
    useEffect(() => {
        if (prevProRef.current === true && pro.isPro === false) {
            // Check if current theme is premium
            const currentThemeData = THEMES.find(t => t.id === theme)
            if (currentThemeData && currentThemeData.premium) {
                console.log("[ProProvider] Pro revoked. Resetting premium theme to default (dark).")
                setTheme('dark')
            }
        }
        prevProRef.current = pro.isPro
    }, [pro.isPro, theme, setTheme])

    return <ProContext.Provider value={pro}>{children}</ProContext.Provider>
}

export function useProContext() {
    return useContext(ProContext)
}
