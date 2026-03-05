/**
 * ProContext.jsx
 * Contexto global de estado Pro.
 * 
 * SEGURIDAD: Los componentes consumen `trialExpired` directamente desde aquí.
 * Nunca calculan la expiración ellos mismos — no tienen acceso a TRIAL_MILLIS.
 */
import { createContext, useContext, useEffect, useRef } from 'react'
import { usePro } from './panel/hooks/usePro'
import { useTheme, THEMES } from './ThemeContext'

export const ProContext = createContext({
    isPro: false,
    proInfo: null,
    trialExpired: false,
    loading: false,
    error: null,
    activateCode: async () => false,
    setError: () => { },
    startTrial: async () => { }
})

export function ProProvider({ children }) {
    const pro = usePro()
    const { theme, setTheme } = useTheme()
    const prevProRef = useRef(pro.isPro)

    // Derivar trialExpired desde proInfo (calculado en usePro, no aquí)
    const trialExpired = pro.proInfo?.trialExpired ?? false

    // Degradar tema premium si se revoca el Pro
    useEffect(() => {
        if (prevProRef.current === true && pro.isPro === false) {
            const currentThemeData = THEMES.find(t => t.id === theme)
            if (currentThemeData?.premium) setTheme('dark')
        }
        prevProRef.current = pro.isPro
    }, [pro.isPro, theme, setTheme])

    const value = Object.freeze({
        isPro: pro.isPro,
        proInfo: pro.proInfo,
        trialExpired,
        loading: pro.loading,
        error: pro.error,
        activateCode: pro.activateCode,
        setError: pro.setError,
        startTrial: pro.startTrial,
    })

    return <ProContext.Provider value={value}>{children}</ProContext.Provider>
}

export function useProContext() {
    return useContext(ProContext)
}
